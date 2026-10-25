from enum import Enum
from typing import List, Optional, Dict, Union, Any, Literal
from pydantic import BaseModel, Field


class InputMode(str, Enum):
    CONTROLLER = "controller"
    HAND = "hand"
    AUTO = "auto"


class ViewConfig(BaseModel):
    device: Union[int, str]
    width: int = 1280
    height: int = 720
    fps: int = 30


class RobotVisConfig(BaseModel):
    urdf_path: str
    mesh_path: Optional[str] = None
    model_scale: float = 1.0
    initial_rotation_euler: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0])


class ControllerHint(BaseModel):
    button: str = Field(min_length=1, max_length=24)
    action: str = Field(min_length=1, max_length=64)


class ControllerHintPanel(BaseModel):
    title: str = Field(min_length=1, max_length=48)
    rows: List[ControllerHint] = Field(default_factory=list, max_length=8)


class TeleopSettings(BaseModel):
    host: str = "0.0.0.0"
    port: int = 4443
    robot_vis: Optional[RobotVisConfig] = None
    input_mode: InputMode = InputMode.CONTROLLER
    speed: float = 1.0
    natural_phone_orientation_euler: List[float] = Field(
        default_factory=lambda: [0.0, -0.7853981633974483, 0.0]
    )
    natural_phone_position: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0])
    camera_views: Dict[str, ViewConfig] = Field(default_factory=dict)
    video_config: Optional[Dict[str, Any]] = None
    # Application-specific instructions, sent to XR clients with the initial config.
    controller_hints: Dict[Literal["left", "right"], ControllerHintPanel] = Field(
        default_factory=dict
    )
