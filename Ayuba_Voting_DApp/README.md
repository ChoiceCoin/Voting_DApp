# Decentralized Decisions API

The Decentralized Decisions API allows data to be fetched directly from the back, it is created using djangorestframework and the source of the data fetched is either submitted from the reactjs frontend through the proposal form or added directly from the backend, it consist of two endpoint urls which are the proposal url and the approved proposal url in which the proposal endpoint is used to post proposals while the approved proposal endpoint is used to get all approved proposals.

# Data from endpoints
# POST
url: http://localhost:8000/api/proposals/
Method: POST
Body:

[
    {
        "title":"",
        "case":"",
        "option1":"",
        "option2":"",
        "amount":""
    }
]

#GET
url: http://localhost:8000/api/approved_proposal/
Method: GET
Body:

"proposal":{
    "title":"",
    "case":"",
    "option1":"",
    "option2":""
}

error format: "An error occur during transaction process"
success format: 
{
    "message":"Your proposal has been submitted"
    "data": proposal.objs.all
}


# Run Steps

The following steps allows you to run the API locally

cd Ayuba_Voting_DApp/backend

pip install -r requirements.txt

python manage.py runserver


# Run the frontend

cd Ayuba_Voting_DApp/frontend

npm i

npm start
