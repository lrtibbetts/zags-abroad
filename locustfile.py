# Load testing script

import random
from locust import HttpLocust, TaskSet, task
from pyquery import PyQuery

# This class lets the "user" explore the following pages
    # login page
    # Signup page
    # Main page
    # Program Detail View page
    # Review form

# This tests the frontend
# Task weights determine how many times each task will execute
# in comparison to one another
class BrowsePages(TaskSet):

    # This loads all of the possible program page extenstions
    def on_start(self):
        self.index_page()
        self.urls_on_current_page = self.programs

    # This navigates to the main page
    def on_stop(self):
        self.client.get("/")

    # Retrieving all of the program extensions
    @task(10)
    def index_page(self):
        self.programs = []
        r = self.client.get("https://zagsabroad-backend.herokuapp.com/programs")
        pq = r.content
        decoded = pq.decode('utf-8')  #list
        decoded = (decoded[1:-1])
        new = (decoded.split(","))
        for item in new:
            item = eval(item)
            program = (''.join(list(item.values())).replace(" ", "%20"))
            self.programs.append(program)

    @task(50)
    def load_page(self, url=None):
        url = random.choice(self.programs)
        r = self.client.get("/program/" + url)

    # Navigating to the sign up page (not actively signing up)
    @task(10)
    def signUp(self):
        self.client.get("/signup")

    # Navigating to the log in page (not actively logging in)
    @task(10)
    def logIn(self):
        self.client.get("/login")

    # Navigating to the student review page (not actively submitting a review)
    @task(30)
    def review(self):
        self.client.get("/review")

# This load tests the backend APIs
class testAPIs(TaskSet):

    def on_start(self):
        self.get_programs()
        self.urls_on_current_page = self.programs_backend

    # Pretending to login
    @task(1)
    def login(self):
        self.client.post("/login", {"email":"cnorman@zagmail.gonzaga.edu", "password": "Ilovemax5"})

    # Pretending to sign up
    @task(1)
    def signup(self):
        self.client.post("/signup", {"email": "jdoe@gonzaga.edu","first": "John", "last": "Doe", "password": "password"})

    # Sending reset email
    @task(1)
    def sendResetEmail(self):
        self.client.post("/sendreset", {"email": "cnorman2@zagmail.gonzaga.edu"})

    # Getting all of the programs
    @task
    def get_programs(self):
        self.programs_backend = []
        r = self.client.get("/programs")
        pq = (r.content).decode('utf-8') #decoded
        new = (pq[1:-1].split(",")) #get rid of brackets and spliting each item
        for item in new:
            item = eval(item)
            program = ''.join(list(item.values()))
            self.programs_backend.append(program)

    @task
    def adminprograms(self):
        self.client.get('/adminprograms')

    @task
    def getLocations(self):
        self.client.get('/locations')

    @task
    def getApplicationLink(self):
        for i in self.urls_on_current_page:
            self.client.post('/applicationlink')

    # Getting all of the core designations
    @task
    def get_core(self):
        self.client.get('/core')

    # Getting the core designations for random program
    @task
    def program_core(self, rand=None):
        rand = random.choice(self.programs_backend)
        result = self.client.post("/programCore", {"program": rand})

    # We want to get all courses that are offered
    @task
    def get_all_courses(self):
        self.client.get('/courses')

    # Get courses for a specific program
    @task(1)
    def programCourses(self):
        self.current_courses = []
        for i in self.urls_on_current_page:
             r = self.client.post("/programcourses", {"program": i})
             pq = (r.content).decode('utf-8')
             new = pq[2:-2].split("},{")

    @task
    def getDepartments(self):
        self.client.get('/departments')

    # Submitting a photo
    @task
    def submitPhotos(self):
        for i in self.urls_on_current_page:
            self.client.post('/photos', {"program":i, "url": "https://res.cloudinary.com/zagsabroad/image/upload/v1553570192/rwwyvhou898rybzmshd4.jpg"})

    # Getting all the photos from a specific program
    @task
    def getProgramPhotos(self):
        for i in self.urls_on_current_page:
            self.client.post('/programphotos')

    @task
    def saveCourse(self):
        self.client.post('/savecourse', {"email": "cnorman2@zagmail.gonzaga.edu"})

    @task
    def deleteAccountCourse(self):
        self.client.post('/deleteaccountcourse', {"email": "cnorman2@zagmail.gonzaga.edu"})

    @task
    def accountCourses(self):
        self.client.post('/accountcourses', {"email": "cnorman2@zagmail.gonzaga.edu"})

    @task
    def getDeletedCourses(self):
        self.client.post("/deletedcourses")

    @task
    def getSubjects(self):
        self.client.get("/subjects")

    @task
    def programSubjects(self):
        for i in self.urls_on_current_page:
            self.client.post('/programsubjects')

    @task
    def submitSurvey(self):
        self.client.post("/submitsurvey", {"name": "claire", "email": "cnorman2@zagmail.gonzaga.edu", "major": "Computer Science", "program": "Akita University"})

    @task
    def programSurveys(self):
        for i in self.urls_on_current_page:
            self.client.post('/programsurveys', {"program": i})

    @task
    def getUnapprovedSurveys(self):
        self.client.get('/unapprovedsurveys')

    @task
    def getApprovedSurveys(self):
        self.client.get('/approvedsurveys')

    @task
    def getSurveys(self):
        self.client.get('/surveys')

class FrontEndStudentUser(HttpLocust):
    task_set = BrowsePages
    host = "https://zagsabroad.herokuapp.com"

    # We assume someone who is on Zags Abroad will be on each page for a
    # relatively long time (20 to 600 seconds), since there's a bunch of text
    # on each page
    min_wait = 2 * 1000
    max_wait = 6 * 1000

class BackendTest(HttpLocust):
    task_set = testAPIs
    host = "https://zagsabroad-backend.herokuapp.com"
    min_wait = 2 * 1000
    max_wait = 6 * 1000
