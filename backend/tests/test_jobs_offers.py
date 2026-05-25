"""Phase 2: Job & Offer negotiation flow tests."""
import os
import pytest
import requests

BASE_URL = (
    os.environ.get("EXPO_BACKEND_URL")
    or os.environ.get("EXPO_PUBLIC_BACKEND_URL")
    or "https://hyperlocal-gigs-3.preview.emergentagent.com"
).rstrip("/")


# ---------- Job Creation & Listing ----------
class TestJobCreate:
    def test_create_job_normal_user(self, api_client, normal_user):
        payload = {
            "title": "TEST_Fix leaking sink",
            "description": "Kitchen sink leak, need urgent plumber",
            "category": "Plumbing",
            "budget": 500.0,
            "estimated_duration": "2 hours",
            "urgency": "high",
            "location": "Bangalore, Koramangala",
            "photos": [],
        }
        r = api_client.post(
            f"{BASE_URL}/api/jobs",
            json=payload,
            params={"user_id": normal_user["id"]},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert "job" in data
        job = data["job"]
        assert job["title"] == payload["title"]
        assert job["budget"] == payload["budget"]
        assert job["status"] == "open"
        assert job["user_id"] == normal_user["id"]
        pytest.shared_job_id = job["id"]

    def test_get_my_jobs(self, api_client, normal_user):
        r = api_client.get(
            f"{BASE_URL}/api/jobs/my",
            params={"user_id": normal_user["id"]},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert isinstance(data["jobs"], list)
        ids = [j["id"] for j in data["jobs"]]
        assert pytest.shared_job_id in ids

    def test_get_nearby_jobs_excludes_own(self, api_client, normal_user, worker_user):
        # Worker should see the job (not their own)
        r = api_client.get(
            f"{BASE_URL}/api/jobs/nearby",
            params={"user_id": worker_user["id"]},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        ids = [j["id"] for j in data["jobs"]]
        assert pytest.shared_job_id in ids

        # Normal user (poster) should NOT see own job in nearby
        r2 = api_client.get(
            f"{BASE_URL}/api/jobs/nearby",
            params={"user_id": normal_user["id"]},
        )
        ids2 = [j["id"] for j in r2.json()["jobs"]]
        assert pytest.shared_job_id not in ids2

    def test_get_job_details(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/jobs/{pytest.shared_job_id}")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert data["job"]["id"] == pytest.shared_job_id
        assert "user" in data
        assert "offers" in data
        assert isinstance(data["offers"], list)

    def test_get_nonexistent_job(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/jobs/nonexistent-id-xyz")
        assert r.status_code == 404


# ---------- Offer / Negotiation Flow ----------
class TestOfferNegotiation:
    def test_worker_creates_offer(self, api_client, worker_user):
        payload = {"proposed_price": 450.0, "message": "I can do this today"}
        r = api_client.post(
            f"{BASE_URL}/api/jobs/{pytest.shared_job_id}/offers",
            json=payload,
            params={"worker_id": worker_user["id"]},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        offer = data["offer"]
        assert offer["proposed_price"] == 450.0
        assert offer["status"] == "pending"
        assert offer["worker_id"] == worker_user["id"]
        pytest.shared_offer_id = offer["id"]

    def test_job_status_changed_to_negotiating(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/jobs/{pytest.shared_job_id}")
        assert r.status_code == 200
        assert r.json()["job"]["status"] == "negotiating"

    def test_duplicate_offer_prevented(self, api_client, worker_user):
        payload = {"proposed_price": 460.0, "message": "Try again"}
        r = api_client.post(
            f"{BASE_URL}/api/jobs/{pytest.shared_job_id}/offers",
            json=payload,
            params={"worker_id": worker_user["id"]},
        )
        assert r.status_code == 400, r.text
        assert "already" in r.text.lower()

    def test_second_worker_can_make_offer(self, api_client, worker_user_2):
        payload = {"proposed_price": 480.0, "message": "I'm available now"}
        r = api_client.post(
            f"{BASE_URL}/api/jobs/{pytest.shared_job_id}/offers",
            json=payload,
            params={"worker_id": worker_user_2["id"]},
        )
        assert r.status_code == 200, r.text
        pytest.shared_offer_2_id = r.json()["offer"]["id"]

    def test_user_counter_offers(self, api_client):
        payload = {
            "counter_offer_price": 400.0,
            "counter_offer_message": "Can you do 400?",
        }
        r = api_client.post(
            f"{BASE_URL}/api/offers/{pytest.shared_offer_id}/counter",
            json=payload,
        )
        assert r.status_code == 200, r.text
        assert r.json()["success"] is True

        # Verify via GET job details
        r = api_client.get(f"{BASE_URL}/api/jobs/{pytest.shared_job_id}")
        offers = r.json()["offers"]
        my_offer = next(o for o in offers if o["id"] == pytest.shared_offer_id)
        assert my_offer["status"] == "counter_offered"
        assert my_offer["counter_offer_price"] == 400.0

    def test_reject_second_offer(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/offers/{pytest.shared_offer_2_id}/reject"
        )
        assert r.status_code == 200, r.text

        # Verify
        r = api_client.get(f"{BASE_URL}/api/jobs/{pytest.shared_job_id}")
        offers = r.json()["offers"]
        o2 = next(o for o in offers if o["id"] == pytest.shared_offer_2_id)
        assert o2["status"] == "rejected"

    def test_accept_offer_assigns_worker_and_sets_price(
        self, api_client, worker_user
    ):
        r = api_client.post(
            f"{BASE_URL}/api/offers/{pytest.shared_offer_id}/accept"
        )
        assert r.status_code == 200, r.text

        # Verify job assignment
        r = api_client.get(f"{BASE_URL}/api/jobs/{pytest.shared_job_id}")
        job = r.json()["job"]
        assert job["status"] == "accepted"
        assert job["accepted_worker_id"] == worker_user["id"]
        # final price should be the counter_offer_price (400)
        assert job["final_price"] == 400.0

        offers = r.json()["offers"]
        accepted = next(o for o in offers if o["id"] == pytest.shared_offer_id)
        assert accepted["status"] == "accepted"

    def test_offer_on_non_open_job_blocked(self, api_client, worker_user_2):
        """After job accepted, new offers should be blocked."""
        payload = {"proposed_price": 350.0, "message": "Late offer"}
        # Use a fresh worker who hasn't offered yet -- create new mobile
        # Register a new worker on the fly
        reg = api_client.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "mobile": "9876500003",
                "full_name": "Late Worker",
                "password": "password123",
                "role": "individual_worker",
            },
        )
        login = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email_or_mobile": "9876500003", "password": "password123"},
        )
        late_user_id = login.json().get("user_id") or login.json().get("user", {}).get("id")
        # Verify if needed
        api_client.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json={"email_or_mobile": "9876500003", "otp": "123456"},
        )
        # Re-login to get user id
        login2 = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email_or_mobile": "9876500003", "password": "password123"},
        )
        late_user_id = login2.json()["user"]["id"]

        r = api_client.post(
            f"{BASE_URL}/api/jobs/{pytest.shared_job_id}/offers",
            json=payload,
            params={"worker_id": late_user_id},
        )
        assert r.status_code == 400, r.text


# ---------- New job for fresh negotiation cycle ----------
class TestStatusTransition:
    def test_full_negotiation_cycle(self, api_client, normal_user, worker_user):
        # 1. Create job (status = open)
        job_payload = {
            "title": "TEST_Paint house",
            "description": "Need wall painting",
            "category": "Painting",
            "budget": 2000.0,
            "estimated_duration": "1 day",
            "urgency": "medium",
            "location": "Mumbai",
            "photos": [],
        }
        r = api_client.post(
            f"{BASE_URL}/api/jobs",
            json=job_payload,
            params={"user_id": normal_user["id"]},
        )
        assert r.status_code == 200
        job_id = r.json()["job"]["id"]
        assert r.json()["job"]["status"] == "open"

        # 2. Worker makes offer (status -> negotiating)
        r = api_client.post(
            f"{BASE_URL}/api/jobs/{job_id}/offers",
            json={"proposed_price": 1800.0, "message": "Quality work"},
            params={"worker_id": worker_user["id"]},
        )
        assert r.status_code == 200
        offer_id = r.json()["offer"]["id"]

        r = api_client.get(f"{BASE_URL}/api/jobs/{job_id}")
        assert r.json()["job"]["status"] == "negotiating"

        # 3. Accept offer directly (no counter); final_price = proposed_price
        r = api_client.post(f"{BASE_URL}/api/offers/{offer_id}/accept")
        assert r.status_code == 200

        r = api_client.get(f"{BASE_URL}/api/jobs/{job_id}")
        job = r.json()["job"]
        assert job["status"] == "accepted"
        assert job["final_price"] == 1800.0
        assert job["accepted_worker_id"] == worker_user["id"]
