from locust import HttpUser, task, between
from faker import Faker
import json
import random

fake = Faker()

class EventRushUser(HttpUser):
    wait_time = between(0.5, 1.5)
    token = None

    VALID_EVENT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    def on_start(self):
       
        self.email = fake.email()
        self.username = fake.user_name()
        self.password = "Test1234!"

       
        registration_payload = {
            "email": self.email,
            "username": self.username,
            "password": self.password
        }

        reg_response = self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(registration_payload),
            headers={"Content-Type": "application/json"}
        )

        if reg_response.status_code not in [200, 201]:
            print(f"⚠️ Registration failed: {reg_response.status_code} -> {reg_response.text}")
            return

        login_payload = {
            "username": self.email, 
            "password": self.password,
            "grant_type": "password",
            "scope": "",
            "client_id": "",
            "client_secret": ""
        }

        login_response = self.client.post(
            "/api/v1/auth/login",
            data=login_payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        if login_response.status_code == 200:
            self.token = login_response.json().get("access_token")
        else:
            print(f" Login failed: {login_response.status_code} -> {login_response.text}")

    @task
    def register_for_event(self):
        if not self.token:
            return

        event_id = random.choice(self.VALID_EVENT_IDS)

        registration_payload = {
            "event_id": event_id
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }

        response = self.client.post(
            "/api/v1/registrations/",
            data=json.dumps(registration_payload),
            headers=headers
        )

        if response.status_code != 201:
            print(f" Event registration failed: {response.status_code} -> {response.text}")
