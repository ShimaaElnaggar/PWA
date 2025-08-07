if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("sw.js")
      .then(function (registration) {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch(function (error) {
        console.log("Service Worker registration failed:", error);
      });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.getElementById("postDropdown");
    const postContent = document.getElementById("postContent");

    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        data.slice(0, 10).forEach((post) => {
          const option = document.createElement("option");
          option.value = post.id;
          option.textContent = post.title;
          dropdown.appendChild(option);
        });

        dropdown.addEventListener("change", () => {
          const selectedId = dropdown.value;
          if (selectedId) {
            fetch(`https://jsonplaceholder.typicode.com/posts/${selectedId}`)
              .then((res) => res.json())
              .then((post) => {
                postContent.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
              `;
              })
              .catch(async () => {
                try {
                  const offlineRes = await fetch("./offline-message.json");
                  const offlineData = await offlineRes.json();
                  postContent.innerHTML = `
      <h3>Offline</h3>
      <p>${offlineData.message}</p>
    `;
                } catch {
                  postContent.innerHTML =
                    "<p>You are offline. Unable to load posts.</p>";
                }
              });
          } else {
            postContent.innerHTML = "";
          }
        });
      })
      .catch(async () => {
        try {
          const offlineRes = await fetch("./offline-message.json");
          const offlineData = await offlineRes.json();
          postContent.innerHTML = `
      <h3>Offline</h3>
      <p>${offlineData.message}</p>
    `;
        } catch {
          postContent.innerHTML =
            "<p>You are offline. Unable to load posts.</p>";
        }
      });
  });
}

window.addEventListener("online", () => {
  document.getElementById("offlineBanner").style.display = "none";
});

window.addEventListener("offline", () => {
  document.getElementById("offlineBanner").style.display = "block";
});
