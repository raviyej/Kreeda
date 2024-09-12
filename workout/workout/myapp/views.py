from django.http import JsonResponse
from django.shortcuts import render

def index(request):
    return render(request,"index.html")
def next(request):
    return render(request,"next.html")
def testpoints(request,excercise):
    
    exerlist = ["Alternate Toe Touch","Spot Jogging","Squats","Push-Ups","Plank"]
    if excercise in exerlist:
        if excercise == "Alternate Toe Touch":
            keypoints = [23,11,15,25,24,12,16,26]
            type = {
                "posture":"standing"
            }
            criteria  = {
                "angle" :60,
                "distance":200
            }

        elif excercise == "Spot Jogging":
            keypoints = [24,26,28,23,25,27]
            type = {
                "posture":"standing"
            }
            criteria  = {
                "angle" :70,
                "distance":30
            }
        elif excercise == "Squats":
            keypoints = [24,26,28,23,25,27]
            type = {
                "posture":"standing"
            }
            criteria  = {
                "angle" :60,
                "distance":100
            }
        elif excercise == "Push-Ups":
            keypoints = [20,16,14,12,19,15,13,11]
            type = {
                "posture":"sleeping"
            }
            criteria  = {
                "angle" :60,
                "distance":200
            }
        elif excercise == "Plank":
            keypoints = [20,16,14,12,19,15,13,11,24,26,28,23,25,27]
            type = {
                "posture":"sleeping"
            }
            criteria  = {
                "angle" :70,
                "distance":30
            }
        else:
            keypoints = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]
            type = {
                "posture":""
            }
            criteria  = {
                "angle" :0,
                "distance":0
            }
    output = {
        "Keypoints":keypoints,
        "Type":type,
        "Criteria":criteria
    }
    return JsonResponse({"Output":output})
