# keyspy — Understanding Questions

1. What does `on_press` do, and when does it get called?
2. Why do we use a `buffer_lock` when appending to `event_buffer`?
3. What is a daemon thread, and why are `sender_loop` and `keepalive_loop` daemon threads?
4. What happens to the buffer if the client crashes before the 20-second send?
5. Why does `keyboard.Listener` use `.join()` but the other two threads don't?
6. What is the difference between `event_buffer.copy()` and just passing `event_buffer` directly?
7. Why do we clear the buffer only after copying it, and not before?
8. What does `get_active_window()` return when no window is in focus?
9. What happens if the user presses a special key like Shift or Ctrl — how does the code handle it?
10. If `send_time` is 20, how many seconds pass before the first batch is sent?
