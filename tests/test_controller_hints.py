from fastapi.testclient import TestClient

from teleop_xr import Teleop
from teleop_xr.config import TeleopSettings


def test_controller_hints_reach_xr_client_on_connect_and_reconnect():
    hints = {
        "left": {
            "title": "左手 · 采集",
            "rows": [
                {"button": "Y", "action": "保存并回位"},
                {"button": "X", "action": "丢弃并回位"},
            ],
        }
    }
    teleop = Teleop(TeleopSettings(controller_hints=hints, motion_activation_hold_s=1.25))
    with TestClient(teleop.app) as client:
        for _ in range(2):
            with client.websocket_connect("/ws") as ws:
                message = ws.receive_json()
                assert message["type"] == "config"
                assert message["data"]["controller_hints"] == hints
                assert message["data"]["motion_activation_hold_s"] == 1.25


def test_other_apps_have_no_collection_shortcuts_by_default():
    assert TeleopSettings().controller_hints == {}


def test_motion_activation_delay_is_finite_and_nonnegative():
    import pytest
    from pydantic import ValidationError

    assert TeleopSettings().motion_activation_hold_s == 0.5
    assert TeleopSettings(motion_activation_hold_s=0).motion_activation_hold_s == 0
    for invalid in (-1, float("nan"), float("inf")):
        with pytest.raises(ValidationError):
            TeleopSettings(motion_activation_hold_s=invalid)
