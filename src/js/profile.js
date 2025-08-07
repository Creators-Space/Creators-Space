 document.addEventListener("DOMContentLoaded", function () {
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function () {
                    // Remove user data from localStorage
                    localStorage.removeItem("loggedInUser");
                    // Redirect to login page
                    window.location.href = "index.html";
                });
            }
        });
        // Load from localStorage
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
            alert("Please login first");
            window.location.href = "index.html";
        } else {
            document.getElementById("userName").textContent = user.name || "Your Name";
            document.getElementById("userEmail").textContent = user.email || "you@example.com";
            if (user.skills) {
                const skillsList = document.getElementById("userSkills");
                user.skills.forEach(skill => {
                    const li = document.createElement("li");
                    li.textContent = skill;
                    skillsList.appendChild(li);
                });
            }

            if (user.courses) {
                const courseList = document.getElementById("userCourses");
                user.courses.forEach(course => {
                    const li = document.createElement("li");
                    li.textContent = course;
                    courseList.appendChild(li);
                });
            }

            if (user.certificates) {
                const certList = document.getElementById("userCertificates");
                user.certificates.forEach(cert => {
                    const li = document.createElement("li");
                    li.textContent = cert;
                    certList.appendChild(li);
                });
            }

            // Profile image preview
            if (user.profileImage) {
                document.getElementById("profile-pic").src = user.profileImage;
            }
        }

        const profilePic = document.getElementById('profile-pic');
        const uploadInput = document.getElementById('upload');

        // On image file selection
        uploadInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profilePic.src = e.target.result;
                    // Save to localStorage
                    user.profileImage = e.target.result;
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                }
                reader.readAsDataURL(file);
            }
        });
        function addSkill() {
            const input = document.getElementById("newSkill");
            const skill = input.value.trim();
            if (skill !== "") {
                const li = document.createElement("li");
                li.textContent = skill;
                document.getElementById("userSkills").appendChild(li);

                // Save to localStorage
                user.skills = user.skills || [];
                user.skills.push(skill);
                localStorage.setItem("loggedInUser", JSON.stringify(user));

                input.value = "";
            }
        }
        function editProfile() {
            alert("Edit Profile functionality coming soon!");
        }







        const skills = ["HTML", "CSS", "JavaScript", "React.js"];
        const courses = [
            { title: "React Bootcamp", progress: 80 },
            { title: "UI/UX Design", progress: 60 },
            { title: "JavaScript Deep Dive", progress: 95 }
        ];
        const certificates = [
            { name: "Postman Student Expert", url: "https://example.com/postman.pdf" },
            { name: "HTML5 Mastery", url: "https://example.com/html5.pdf" },
            { name: "JavaScript Ninja", url: "https://example.com/js-ninja.pdf" }
        ];

        // Populate Skills
        function loadSkills() {
            const list = document.getElementById("userSkills");
            list.innerHTML = "";
            skills.forEach((skill, index) => {
                const li = document.createElement("li");
                li.innerHTML = `${skill} <span style="cursor:pointer;color:red;" onclick="removeSkill(${index})">✖</span>`;
                list.appendChild(li);
            });
        }

        function addSkill() {
            const input = document.getElementById("newSkill");
            const skill = input.value.trim();
            if (skill) {
                skills.push(skill);
                input.value = "";
                loadSkills();
            }
        }

        function removeSkill(index) {
            skills.splice(index, 1);
            loadSkills();
        }

        // Populate Courses
        function loadCourses() {
            const list = document.getElementById("userCourses");
            list.innerHTML = "";
            courses.forEach(course => {
                const li = document.createElement("li");
                li.innerHTML = `
      <div style="flex:1">${course.title}</div>
      <div class="progress-bar"><div class="progress-bar-inner" style="width: ${course.progress}%"></div></div>
    `;
                list.appendChild(li);
            });
        }

        // Populate Certificates
        function loadCertificates() {
            const list = document.getElementById("userCertificates");
            list.innerHTML = "";
            certificates.forEach(cert => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${cert.url}" class="certificate-link" target="_blank">📄 ${cert.name}</a>`;
                list.appendChild(li);
            });
        }

        loadSkills();
        loadCourses();
        loadCertificates();



        document.addEventListener('DOMContentLoaded', function () {
            const userImage = document.getElementById('user-image');

            // Suppose you get the user's image URL from backend or localStorage
            const userImageUrl = ""; // Empty means no profile image

            if (userImageUrl && userImageUrl.trim() !== "") {
                userImage.src = userImageUrl;
            } else {
                // Set default icon if user hasn't set a profile picture
                userImage.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // You can replace this with your own icon
            }
        });



