/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var savedReviews = [];
var rating = 3;
var stars = null;
var picture;
//Have to use plugin for picture
var currentPicture;
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        if (!localStorage.getItem("kyte0017")) {
            console.log("Setting Local Storage");
            localStorage.setItem('kyte0017', JSON.stringify(savedReviews));
        }
        else {
            savedReviews = JSON.parse(localStorage.getItem('kyte0017'));
            //
            app.displayReview();
        }
    }
    , onDeviceReady: function () {
        //        app.receivedEvent('deviceready');
        app.clearAddModal();
        app.takePicture();
        app.formData();
        app.deleteMe();
        //app.starUp();
    }
    , clearAddModal: function () {
        var clearModal = document.querySelector("#clearModal");
        clearModal.addEventListener("touchend", function (ev) {
            document.querySelector("#itemName").value = "";
            //document.querySelector("#starRating").value = "";
            app.starUp();
            this.removeEventListener;
        });
    }
    , takePicture: function () {
        var snapButton = document.querySelector("#takePicture");
        snapButton.addEventListener("touchend", function (ev) {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50
                , destinationType: Camera.DestinationType.FILE_URI
                , //         destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA
                , encodingType: Camera.EncodingType.JPEG
                , mediaType: Camera.MediaType.PICTURE
                , targetWidth: 300
                , targetHeight: 300
                , saveToPhotoAlbum: true
            });

            function onSuccess(imageURI) {
                var image = document.getElementById('myImage');
                console.log(imageURI);
                image.src = imageURI;
                picture = imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
            this.removeEventListener;
        });
    }
    , formData: function () {
        var saveButton = document.querySelector("#saveBtn");
        saveButton.addEventListener("touchend", function (ev) {
            console.log("save!");
            var title = document.querySelector("#itemName").value;
            // var ratingModal = document.querySelector("#starRating");
            var timeId = Date.now();
            //CREATING THE OBJECT FOR LOCAL STORAGE        
            var indivReview = {
                id: timeId
                , review: picture
                , title: title
                , stars: rating
            }
            savedReviews.push(indivReview);
            app.setStorage();
            app.displayReview();
            this.removeEventListener;
        });
    }
    , starUp: function () {
        var reviewModal = document.querySelector('#reviewModal');
        stars = reviewModal.querySelectorAll('.star');
        app.addListeners();
        app.setRating(); //based on global rating variable value
    }
    , addListeners: function () {
  [].forEach.call(stars, function (star, index) {
            star.addEventListener('touchend', (function (idx) {
                console.log('adding listener', index);
                return function () {
                    rating = idx + 1;
                    console.log('Rating is now', rating)
                    app.setRating();
                }
            })(index));
        });
    }
    , setRating: function () {
  [].forEach.call(stars, function (star, index) {
            if (rating > index) {
                star.classList.add('rated');
                console.log('added rated on', index);
            }
            else {
                star.classList.remove('rated');
                console.log('removed rated on', index);
            }
        });
    }
    , setStorage: function () {
        //savedReviews.push(indivReview);
        localStorage.setItem("kyte0017", JSON.stringify(savedReviews));
    }
    , displayReview: function () {
        var ul = document.querySelector('#content-list');
        ul.innerHTML = "";
        for (var i = 0; i < savedReviews.length; i++) {
            console.log(savedReviews[i]);
            //CREATING THE ELEMENTS WITH CONTENT
            var ul = document.querySelector('#content-list');
            var listItem = document.createElement('li');
            listItem.className = 'table-view-cell media';
            //var listItem = document.createElement('li').className('table-view-cell media ' + savedReviews[i].id);
            var anchorPic = document.createElement('a');
            anchorPic.className = 'navigate-right ' + savedReviews[i].id;
            anchorPic.href = "#deleteModal";
            anchorPic.addEventListener("touchend", function (ev) {
                
                var rawString = (this.className).split(' ');
                currentPicture = rawString[1];
                for (var q = 0; q < savedReviews.length; q++) {
                    if (currentPicture == savedReviews[q].id) {
                        //  console.log(savedReviews[i].id);
                        //Load modal with data
                        document.querySelector('#myImage').src = savedReviews[q].review;
                        document.querySelector('#itemNameDelete').value = savedReviews[q].title;
                        //  document.querySelector('#starRatingDelete').value = savedReviews[i].stars;
                    }
                }
                this.removeEventListener;
            });
            
            var imgContent = document.createElement('img');
            imgContent.className = 'navigate-right';
            imgContent.src = savedReviews[i].review;
            
            
            console.log(imgContent);
            console.log(savedReviews[i].review);
        
            var reviewTitle = document.createElement('div');
            reviewTitle.className = 'media-body';
            reviewTitle.innerHTML = savedReviews[i].title;
            //CREATING THE STARS LIST 
            var starsDiv = document.createElement('div');
            var numberofStars = 5;
            for (var p = 0; p < numberofStars; p++) {
                var stars = document.createElement('span');
                stars.className = 'star';
            //CREATING BLANK STARS
                stars.innerHTML = "&nbsp;";
                starsDiv.appendChild(stars);
            }
/*            console.log(starsDiv);
            console.log(starsDiv.childNodes);
            console.log(starsDiv.childNodes.length);
            console.log(savedReviews[i].stars);*/
            //RE-CREATING THE RATING
            for (var d = 0; d < starsDiv.childNodes.length; d++) {
                if (d < savedReviews[i].stars) {
                    starsDiv.childNodes[d].classList.add('rated');
                }
                else {
                    starsDiv.childNodes[d].classList.remove('rated')
                }
            }
            //APPENDING
            reviewTitle.appendChild(starsDiv);
            anchorPic.appendChild(imgContent);
            anchorPic.appendChild(reviewTitle);
            listItem.appendChild(anchorPic);
            ul.appendChild(listItem);
        }
    }
    , deleteMe: function () {
        var deleteBtn = document.querySelector('#deleteBtn');
        deleteBtn.addEventListener("touchend", function (ev) {
            for (var i = 0; i < savedReviews.length; i++) {
                if (currentPicture == savedReviews[i].id) {
                    //delete
                    savedReviews.splice(i, 1);
                    app.setStorage();
                    app.displayReview();
                }
            }
        });
    }
};
app.initialize();