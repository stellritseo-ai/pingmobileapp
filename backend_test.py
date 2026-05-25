import requests
import json
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://hyperlocal-gigs-3.preview.emergentagent.com/api"

# Test data
test_users = {
    "normal_user": {
        "email": "testuser@example.com",
        "full_name": "Test User",
        "password": "password123",
        "role": "normal_user"
    },
    "individual_worker": {
        "mobile": "9876543210",
        "full_name": "Test Worker",
        "password": "password123",
        "role": "individual_worker"
    },
    "business_owner": {
        "email": "business@example.com",
        "full_name": "Test Business",
        "password": "password123",
        "role": "business_owner"
    }
}

# Store user IDs for later tests
user_ids = {}

def print_test_header(test_name):
    print("\n" + "="*80)
    print(f"TEST: {test_name}")
    print("="*80)

def print_result(success, message, response=None):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")
    if response:
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response Text: {response.text}")
    print("-"*80)

def test_user_registration(user_type):
    """Test user registration for different user types"""
    print_test_header(f"User Registration - {user_type}")
    
    user_data = test_users[user_type]
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=user_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("user_id"):
                user_ids[user_type] = data["user_id"]
                print_result(True, f"Registration successful for {user_type}", response)
                return True, data
            else:
                print_result(False, f"Registration response missing required fields", response)
                return False, None
        else:
            print_result(False, f"Registration failed with status {response.status_code}", response)
            return False, None
            
    except Exception as e:
        print_result(False, f"Registration request failed: {str(e)}")
        return False, None

def test_otp_verification(user_type):
    """Test OTP verification"""
    print_test_header(f"OTP Verification - {user_type}")
    
    user_data = test_users[user_type]
    email_or_mobile = user_data.get("email") or user_data.get("mobile")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/verify-otp",
            json={
                "email_or_mobile": email_or_mobile,
                "otp": "123456"  # Development OTP
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("user"):
                print_result(True, f"OTP verification successful for {user_type}", response)
                return True, data
            else:
                print_result(False, f"OTP verification response missing required fields", response)
                return False, None
        else:
            print_result(False, f"OTP verification failed with status {response.status_code}", response)
            return False, None
            
    except Exception as e:
        print_result(False, f"OTP verification request failed: {str(e)}")
        return False, None

def test_login(user_type):
    """Test user login"""
    print_test_header(f"User Login - {user_type}")
    
    user_data = test_users[user_type]
    email_or_mobile = user_data.get("email") or user_data.get("mobile")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={
                "email_or_mobile": email_or_mobile,
                "password": user_data["password"]
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                print_result(True, f"Login successful for {user_type}", response)
                return True, data
            else:
                print_result(False, f"Login response missing success field", response)
                return False, None
        else:
            print_result(False, f"Login failed with status {response.status_code}", response)
            return False, None
            
    except Exception as e:
        print_result(False, f"Login request failed: {str(e)}")
        return False, None

def test_get_user_profile(user_type):
    """Test getting user profile"""
    print_test_header(f"Get User Profile - {user_type}")
    
    if user_type not in user_ids:
        print_result(False, f"No user_id found for {user_type}. Skipping profile test.")
        return False, None
    
    user_id = user_ids[user_type]
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/user/profile/{user_id}",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("user"):
                print_result(True, f"Profile retrieval successful for {user_type}", response)
                return True, data
            else:
                print_result(False, f"Profile response missing required fields", response)
                return False, None
        else:
            print_result(False, f"Profile retrieval failed with status {response.status_code}", response)
            return False, None
            
    except Exception as e:
        print_result(False, f"Profile retrieval request failed: {str(e)}")
        return False, None

def test_duplicate_registration(user_type):
    """Test that duplicate registration is prevented"""
    print_test_header(f"Duplicate Registration Prevention - {user_type}")
    
    user_data = test_users[user_type]
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=user_data,
            timeout=10
        )
        
        if response.status_code == 400:
            data = response.json()
            if "already exists" in data.get("detail", "").lower():
                print_result(True, f"Duplicate registration correctly prevented for {user_type}", response)
                return True, data
            else:
                print_result(False, f"Wrong error message for duplicate registration", response)
                return False, None
        else:
            print_result(False, f"Duplicate registration should return 400 status", response)
            return False, None
            
    except Exception as e:
        print_result(False, f"Duplicate registration test failed: {str(e)}")
        return False, None

def test_invalid_login():
    """Test login with invalid credentials"""
    print_test_header("Invalid Login Test")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={
                "email_or_mobile": "nonexistent@example.com",
                "password": "wrongpassword"
            },
            timeout=10
        )
        
        if response.status_code == 404:
            print_result(True, "Invalid login correctly rejected", response)
            return True, None
        else:
            print_result(False, f"Invalid login should return 404 status", response)
            return False, None
            
    except Exception as e:
        print_result(False, f"Invalid login test failed: {str(e)}")
        return False, None

def test_invalid_otp():
    """Test OTP verification with invalid OTP"""
    print_test_header("Invalid OTP Test")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/verify-otp",
            json={
                "email_or_mobile": "testuser@example.com",
                "otp": "999999"  # Invalid OTP
            },
            timeout=10
        )
        
        if response.status_code == 400:
            print_result(True, "Invalid OTP correctly rejected", response)
            return True, None
        else:
            print_result(False, f"Invalid OTP should return 400 status", response)
            return False, None
            
    except Exception as e:
        print_result(False, f"Invalid OTP test failed: {str(e)}")
        return False, None

def run_all_tests():
    """Run all backend API tests"""
    print("\n" + "="*80)
    print("PING BUZ BACKEND API TEST SUITE")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    results = {
        "passed": 0,
        "failed": 0,
        "total": 0
    }
    
    # Test 1: Register Normal User
    success, _ = test_user_registration("normal_user")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 2: Verify OTP for Normal User
    success, _ = test_otp_verification("normal_user")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 3: Login Normal User
    success, _ = test_login("normal_user")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 4: Get Normal User Profile
    success, _ = test_get_user_profile("normal_user")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 5: Register Individual Worker
    success, _ = test_user_registration("individual_worker")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 6: Verify OTP for Individual Worker
    success, _ = test_otp_verification("individual_worker")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 7: Register Business Owner
    success, _ = test_user_registration("business_owner")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 8: Verify OTP for Business Owner
    success, _ = test_otp_verification("business_owner")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 9: Duplicate Registration Prevention
    success, _ = test_duplicate_registration("normal_user")
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 10: Invalid Login
    success, _ = test_invalid_login()
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 11: Invalid OTP
    success, _ = test_invalid_otp()
    results["total"] += 1
    if success:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Print Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {results['total']}")
    print(f"Passed: {results['passed']} ✅")
    print(f"Failed: {results['failed']} ❌")
    print(f"Success Rate: {(results['passed']/results['total']*100):.1f}%")
    print(f"Test Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)
    
    return results

if __name__ == "__main__":
    run_all_tests()
