# Decisions

- The collection application uses button 0 with a configurable hold delay; the pre-existing `teleopEngaged` state uses button 1 for IK and must remain unchanged.
- The wrist status reports trigger activation, not physical motion or successful robot command execution.
- The application supplies `motion_activation_hold_s` from its existing `long_press_s` configuration.
