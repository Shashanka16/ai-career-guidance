def get_careers():

    return {

        "Data Scientist": {

            "skills": [
                "python",
                "statistics",
                "machine learning",
                "sql",
                "pandas"
            ],

            "interests": [
                "data",
                "ai",
                "analytics",
                "insights"
            ],

            "related_careers": [
                "Machine Learning Engineer",
                "Data Engineer",
                "AI Engineer"
            ],

            "roadmap": [
                "Python",
                "Statistics",
                "SQL",
                "Machine Learning",
                "Deep Learning"
            ],

            "resources": [

                {
                    "name": "Coursera Data Science",
                    "url": "https://www.coursera.org/browse/data-science"
                },

                {
                    "name": "Roadmap.sh",
                    "url": "https://roadmap.sh/ai-data-scientist"
                }

            ]
        },

        "Machine Learning Engineer": {

            "skills": [
                "python",
                "machine learning",
                "deep learning",
                "tensorflow",
                "pytorch"
            ],

            "interests": [
                "ai",
                "models",
                "automation",
                "research"
            ],

            "related_careers": [
                "Data Scientist",
                "AI Engineer",
                "MLOps Engineer"
            ],

            "roadmap": [
                "Python",
                "Statistics",
                "Machine Learning",
                "Deep Learning",
                "TensorFlow",
                "PyTorch",
                "MLOps"
            ],

            "resources": [

                {
                    "name": "Coursera Machine Learning",
                    "url": "https://www.coursera.org/learn/machine-learning"
                },

                {
                    "name": "DeepLearning.AI",
                    "url": "https://www.deeplearning.ai"
                },

                {
                    "name": "TensorFlow Documentation",
                    "url": "https://www.tensorflow.org"
                }

            ]
        },

        "Web Developer": {

            "skills": [
                "html",
                "css",
                "javascript",
                "react",
                "django"
            ],

            "interests": [
                "web",
                "design",
                "frontend",
                "backend"
            ],

            "related_careers": [
                "Frontend Developer",
                "Backend Developer",
                "Full Stack Developer"
            ],

            "roadmap": [
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Next.js",
                "Backend Development",
                "Database",
                "Deployment"
            ],

            "resources": [

                {
                    "name": "FreeCodeCamp",
                    "url": "https://www.freecodecamp.org"
                },

                {
                    "name": "MDN Web Docs",
                    "url": "https://developer.mozilla.org"
                },

                {
                    "name": "Next.js Documentation",
                    "url": "https://nextjs.org/docs"
                }

            ]
        },

        "Cyber Security Analyst": {

            "skills": [
                "networking",
                "linux",
                "security",
                "python",
                "cryptography"
            ],

            "interests": [
                "security",
                "hacking",
                "systems",
                "protection"
            ],

            "related_careers": [
                "Security Engineer",
                "Penetration Tester",
                "Cloud Security Engineer"
            ],

            "roadmap": [
                "Computer Networks",
                "Linux",
                "Python",
                "Cyber Security Basics",
                "Ethical Hacking",
                "Cryptography",
                "Penetration Testing"
            ],

            "resources": [

                {
                    "name": "TryHackMe",
                    "url": "https://tryhackme.com"
                },

                {
                    "name": "Hack The Box",
                    "url": "https://www.hackthebox.com"
                },

                {
                    "name": "OWASP",
                    "url": "https://owasp.org"
                }

            ]
        },

        "App Developer": {

            "skills": [
                "flutter",
                "dart",
                "kotlin",
                "java",
                "react native"
            ],

            "interests": [
                "mobile",
                "apps",
                "ui",
                "ux"
            ],

            "related_careers": [
                "Android Developer",
                "iOS Developer",
                "Mobile App Engineer"
            ],

            "roadmap": [
                "Programming Basics",
                "Flutter",
                "Dart",
                "UI/UX Design",
                "Firebase",
                "State Management",
                "App Deployment"
            ],

            "resources": [

                {
                    "name": "Flutter Documentation",
                    "url": "https://docs.flutter.dev"
                },

                {
                    "name": "Firebase Documentation",
                    "url": "https://firebase.google.com/docs"
                },

                {
                    "name": "React Native Documentation",
                    "url": "https://reactnative.dev"
                }

            ]
        }

    }


def recommend_career(user_skills, user_interests):

    careers = get_careers()

    best_match = None
    max_score = 0

    best_details = {
        "matched_skills": [],
        "missing_skills": [],
        "matched_interests": [],
        "match_percentage": 0
    }

    # Convert user input to lowercase
    normalized_skills = [
        skill.strip().lower()
        for skill in user_skills
    ]

    normalized_interests = [
        interest.strip().lower()
        for interest in user_interests
    ]

    for career, data in careers.items():

        score = 0

        matched_skills = []
        missing_skills = []
        matched_interests = []

        # Check skills
        for skill in data["skills"]:

            if skill in normalized_skills:
                score += 2
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

        # Check interests
        for interest in normalized_interests:

            if interest in data["interests"]:
                score += 1
                matched_interests.append(interest)

        # Calculate maximum possible score
        max_possible_score = (
            len(data["skills"]) * 2
            + len(data["interests"])
        )

        if max_possible_score > 0:
            match_percentage = round(
                (score / max_possible_score) * 100
            )
        else:
            match_percentage = 0

        # Update best career
        if score > max_score:

            max_score = score
            best_match = career

            best_details = {
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "matched_interests": matched_interests,
                "match_percentage": match_percentage
            }

    return (
        best_match,
        max_score,
        careers,
        best_details
    )