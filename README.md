# Attendance System / Backend
> Attendance System backend services.
#

## Technologies:
The main technologies used in the development of this application are [Node.js](https://nodejs.org/en/) for the server-side logic, [MongoDB](https://www.mongodb.com/) for the data persistance, [Amazon Rekognition](https://aws.amazon.com/rekognition/) for the face recognition, [Amazon S3](https://aws.amazon.com/tr/s3/) for the cloud object storage, and [Heroku](https://www.heroku.com/) for the deployment.
#

## How to Use 

First things first: you must properly set the following environment variables:

- AWS_ACCESS_KEY_ID (Amazon AWS Access Key)
- AWS_SECRET_ACCESS_KEY (Amazon AWS Secret Key)
- AWS_REGION (Amazon AWS Region)
- SENDGRID_API_KEY (Sendgrid Api Key)
- SUPPORT_EMAIL 
- FROM_EMAIL
- RESET_PASSWORD_TEMPLATEID (Sendgrid Dynamic Email Template Id for Reset Password)
- VERIFY_EMAIL_TEMPLATEID (Sendgrid Dynamic Email Template Id for Email Verification)
- JWT (JSON Web Token)
- MONGOURI (MongoDB URL)
- NODE_OPTIONS=--max_old_space_size=2560
- PORT=3000

**Step 1:**

Download or clone this repo by using the link below:

```
https://github.com/merthankavak/attendance_system/
```

for **ssh** 

```
git clone git@github.com:merthankavak/attendance_system.git
```

**Step 2:**

Go to project root and execute the following command in console to get the required dependencies: 

```
$ npm install
```
**Step 3:**

To run this project all we have to do is run this command

```
$ npm start
```

## Team NiceTRY -- Members:
### [Merthan **Kavak**](https://github.com/merthankavak)  
### [Alper **Tekin**](https://github.com/alpertknn)  
### [İlker **Kararmış**](https://github.com/Inventore0)  

