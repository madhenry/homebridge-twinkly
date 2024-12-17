# configure your phone to use the proxy at ip:8080 and install the mitmproxy certificate while browsing to mitm.it on your phone
# run with:
# mitmproxy -s save-movies.py  --set console_eventlog_verbosity=debug

from mitmproxy import http
import os

SAVE_DIR = "requests"  # Directory to save request bodies
TARGET_URL = "led/movie/full"  # Substring to match in the URL

def start():
  if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

def request(flow: http.HTTPFlow) -> None:
  # Check if the request URL contains the target substring
  
  if TARGET_URL in flow.request.pretty_url:
    # Extract binary content
    request_body = flow.request.content
    print(f"Checking URL: {flow.request.pretty_url}")
    if request_body:
      # Save to a file
      file_name = os.path.join(SAVE_DIR, f"{flow.id}.bin")
      print(f"Saving request: {flow.request.pretty_url}")
      with open(file_name, "wb") as f:
        f.write(request_body)
      print(f"Saved request body to {file_name}")
