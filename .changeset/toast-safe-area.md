---
'@thewhileloop/whileui': patch
---

`ToastContainer` clears the safe area at its edge: below the status bar and Dynamic Island
at the top, above the home indicator at the bottom. It sat flush with the screen edge, so
apps padded it by hand, each by a guess, and a fixed margin left the toast under the
Dynamic Island on newer iPhones. Remove any safe-area padding you added to it.
