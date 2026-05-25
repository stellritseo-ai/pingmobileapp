"""Shared fixtures for Ping Buz backend tests."""
import os
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load frontend env to obtain public backend URL
load_dotenv(Path(__file__).parent.parent.parent / "frontend" / ".env")

BASE_URL = (
    os.environ.get("EXPO_BACKEND_URL")
    or os.environ.get("EXPO_PUBLIC_BACKEND_URL")
).rstrip("/")


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _register_or_login(api_client, payload_register, login_id, password):
    """Try to register; if exists, login. Returns user dict."""
    # Try register
    r = api_client.post(f"{BASE_URL}/api/auth/register", json=payload_register)
    if r.status_code == 200:
        # Verify OTP to mark verified
        api_client.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json={"email_or_mobile": login_id, "otp": "123456"},
        )

    # Now login
    r = api_client.post(
        f"{BASE_URL}/api/auth/login",
        json={"email_or_mobile": login_id, "password": password},
    )
    assert r.status_code == 200, f"Login failed for {login_id}: {r.text}"
    data = r.json()

    if data.get("requires_otp"):
        api_client.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json={"email_or_mobile": login_id, "otp": "123456"},
        )
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email_or_mobile": login_id, "password": password},
        )
        data = r.json()

    return data["user"]


@pytest.fixture(scope="session")
def normal_user(api_client):
    return _register_or_login(
        api_client,
        {
            "email": "testuser@example.com",
            "full_name": "Test Normal User",
            "password": "password123",
            "role": "normal_user",
        },
        "testuser@example.com",
        "password123",
    )


@pytest.fixture(scope="session")
def worker_user(api_client):
    return _register_or_login(
        api_client,
        {
            "mobile": "9876543210",
            "full_name": "Worker User",
            "password": "password123",
            "role": "individual_worker",
        },
        "9876543210",
        "password123",
    )


@pytest.fixture(scope="session")
def worker_user_2(api_client):
    """Second worker for duplicate-offer / multi-offer tests."""
    return _register_or_login(
        api_client,
        {
            "mobile": "9876500002",
            "full_name": "Worker Two",
            "password": "password123",
            "role": "individual_worker",
        },
        "9876500002",
        "password123",
    )
