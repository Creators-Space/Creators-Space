 // =======================
        // User Profile Management
        // =======================

        // Simulated login (replace this with your actual login flow)
        // Here we assume that after successful login, we store user email in localStorage
        // Example:
        // localStorage.setItem("loggedInUser", JSON.stringify({ name: "John Doe", email: "john@example.com" }));

        document.addEventListener("DOMContentLoaded", () => {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

            if (!loggedInUser) {
                alert("Please log in first.");
                window.location.href = "login.html";
                return;
            }

            // Elements
            const displayNameEl = document.getElementById("displayName");
            const userEmailEl = document.getElementById("userEmail");
            const displayNameInput = document.getElementById("displayNameInput");

            const bioText = document.getElementById("bioText");
            const bioInput = document.getElementById("bioInput");

            const genresText = document.getElementById("genresText");
            const genresInput = document.getElementById("genresInput");

            const editBtn = document.getElementById("editBtn");
            const saveBtn = document.getElementById("saveBtn");

            const profileAvatar = document.getElementById("profile-avatar");
            const uploadInput = document.getElementById("upload");

            // Skills
            const skillInput = document.getElementById("skillInput");
            const addSkillBtn = document.getElementById("addSkillBtn");
            const skillsList = document.getElementById("skillsList");

            // Certificates
            const certificateNameInput = document.getElementById("certificateNameInput");
            const certificateIssuerInput = document.getElementById("certificateIssuerInput");
            const addCertificateBtn = document.getElementById("addCertificateBtn");
            const certificatesList = document.getElementById("certificatesList");

            // Courses
            const courseNameInput = document.getElementById("courseNameInput");
            const courseProgressInput = document.getElementById("courseProgressInput");
            const addCourseBtn = document.getElementById("addCourseBtn");
            const coursesList = document.getElementById("coursesList");

            // ======================
            // Load User Data
            // ======================
            let userData = JSON.parse(localStorage.getItem(`profile_${loggedInUser.email}`)) || {
                name: loggedInUser.name || "User",
                email: loggedInUser.email || "",
                bio: "",
                genres: "",
                avatar: "",
                skills: [],
                certificates: [],
                courses: []
            };

            function saveUserData() {
                localStorage.setItem(`profile_${loggedInUser.email}`, JSON.stringify(userData));
            }

            function renderProfile() {
                displayNameEl.textContent = userData.name;
                userEmailEl.textContent = userData.email;
                bioText.textContent = userData.bio || "No bio set.";
                genresText.textContent = userData.genres || "No favorite genres set.";
                profileAvatar.src = userData.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                renderSkills();
                renderCertificates();
                renderCourses();
            }

            // ======================
            // Edit/Save Profile
            // ======================
            editBtn.addEventListener("click", () => {
                displayNameInput.value = userData.name;
                bioInput.value = userData.bio;
                genresInput.value = userData.genres;

                displayNameEl.style.display = "none";
                displayNameInput.style.display = "block";

                bioText.style.display = "none";
                bioInput.style.display = "block";

                genresText.style.display = "none";
                genresInput.style.display = "block";

                editBtn.style.display = "none";
                saveBtn.style.display = "inline-block";
            });

            saveBtn.addEventListener("click", () => {
                userData.name = displayNameInput.value.trim();
                userData.bio = bioInput.value.trim();
                userData.genres = genresInput.value.trim();
                saveUserData();
                renderProfile();

                displayNameEl.style.display = "block";
                displayNameInput.style.display = "none";

                bioText.style.display = "block";
                bioInput.style.display = "none";

                genresText.style.display = "block";
                genresInput.style.display = "none";

                editBtn.style.display = "inline-block";
                saveBtn.style.display = "none";
            });

            // ======================
            // Profile Picture
            // ======================
            uploadInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    userData.avatar = reader.result;
                    saveUserData();
                    renderProfile();
                };
                reader.readAsDataURL(file);
            });

            // ======================
            // Skills
            // ======================
            function renderSkills() {
                skillsList.innerHTML = "";
                userData.skills.forEach((skill, index) => {
                    const div = document.createElement("div");
                    div.className = "skill-item";
                    div.textContent = skill;

                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "×";
                    removeBtn.className = "remove-btn";
                    removeBtn.onclick = () => {
                        userData.skills.splice(index, 1);
                        saveUserData();
                        renderSkills();
                    };
                    div.appendChild(removeBtn);
                    skillsList.appendChild(div);
                });
            }

            addSkillBtn.addEventListener("click", () => {
                const skill = skillInput.value.trim();
                if (skill) {
                    userData.skills.push(skill);
                    saveUserData();
                    renderSkills();
                    skillInput.value = "";
                }
            });

            // ======================
            // Certificates
            // ======================
            function renderCertificates() {
                certificatesList.innerHTML = "";
                userData.certificates.forEach((cert, index) => {
                    const div = document.createElement("div");
                    div.className = "certificate-item";
                    div.textContent = `${cert.name} - ${cert.issuer}`;

                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "×";
                    removeBtn.className = "remove-btn";
                    removeBtn.onclick = () => {
                        userData.certificates.splice(index, 1);
                        saveUserData();
                        renderCertificates();
                    };
                    div.appendChild(removeBtn);
                    certificatesList.appendChild(div);
                });
            }

            addCertificateBtn.addEventListener("click", () => {
                const name = certificateNameInput.value.trim();
                const issuer = certificateIssuerInput.value.trim();
                if (name && issuer) {
                    userData.certificates.push({ name, issuer });
                    saveUserData();
                    renderCertificates();
                    certificateNameInput.value = "";
                    certificateIssuerInput.value = "";
                }
            });

            // ======================
            // Courses
            // ======================
            function renderCourses() {
                coursesList.innerHTML = "";
                userData.courses.forEach((course, index) => {
                    const div = document.createElement("div");
                    div.className = "course-item";
                    div.innerHTML = `
                <span>${course.name}</span>
                <progress value="${course.progress}" max="100"></progress>
                <span>${course.progress}%</span>
            `;

                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "×";
                    removeBtn.className = "remove-btn";
                    removeBtn.onclick = () => {
                        userData.courses.splice(index, 1);
                        saveUserData();
                        renderCourses();
                    };
                    div.appendChild(removeBtn);
                    coursesList.appendChild(div);
                });
            }

            addCourseBtn.addEventListener("click", () => {
                const name = courseNameInput.value.trim();
                const progress = parseInt(courseProgressInput.value, 10);
                if (name && !isNaN(progress) && progress >= 0 && progress <= 100) {
                    userData.courses.push({ name, progress });
                    saveUserData();
                    renderCourses();
                    courseNameInput.value = "";
                    courseProgressInput.value = "";
                }
            });

            // ======================
            // Initial Render
            // ======================
            renderProfile();
        });
