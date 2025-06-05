# backend/tests/integration/test_event_flow.py
def test_create_and_register_event_flow(client, admin_token, user_token):
    """Test the complete flow of creating an event and registering for it"""
    # Admin creates event
    event_data = {"title": "New Conference", "description": "Tech conference", 
                 "location": "Main Hall", "start_time": "2025-08-15T10:00:00", 
                 "end_time": "2025-08-15T16:00:00", "capacity": 100}
    
    response = client.post("/api/v1/events/", json=event_data, headers=admin_token)
    assert response.status_code == 200
    event_id = response.json()["id"]
    
    # User registers for event
    response = client.post(
        "/api/v1/registrations/", 
        json={"event_id": event_id},
        headers=user_token
    )
    assert response.status_code == 200
    assert "qr_code_url" in response.json()
    
    # Verify registration appears in user's registrations
    response = client.get("/api/v1/registrations/", headers=user_token)
    assert response.status_code == 200
    assert any(r["event_id"] == event_id for r in response.json())