const dark = '#000000';
const white = 'white';
const lighter = '#e0e0e0';
const button = '#3A3A3A';
function load_box() {
    const targetElement = document.querySelector('.job-details-jobs-unified-top-card__job-title');
    if (targetElement) {
        let container = document.createElement('div');
        container.id = "scanjd_container"
        container.style.cssText = `
            background: ${white};
            width: 100%;
            height: 145px;
            border-radius: 12px;
            margin-top: 20px;
            margin-bottom: 10px;
            display: flex;
            box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.7);
        `;
        let left_div = document.createElement('div')
        left_div.id = "left_div"
        left_div.style.cssText = `
            padding: 5px;
            width: 40%;
            border-radius: 12px;
            background: linear-gradient(to bottom right, #767676 , #000000);
        `;
        let leftHeader = document.createElement("div");
        leftHeader.id = "leftHeader";
        leftHeader.style.color = "white";
        let heading = document.createElement("h3");
        heading.id = 'heading';
        heading.textContent = "SCAN JD";
        heading.style.cssText = `
            font-family: 'SF Pro Display', sans-serif;
            color: ${white};
            font-weight: bold;
            font-size: 24px;
            text-align: center;
        `;
        leftHeader.appendChild(heading);
        let leftBody = document.createElement("div");
        leftBody.id = "leftBody";

        left_div.appendChild(leftHeader);
        left_div.appendChild(leftBody);

        let right_div = document.createElement('div')
        right_div.id = "right_div"
        right_div.style.cssText = `
            width: 60%;
            background: ${white};
            border-radius: 12px;
            height: 145px;
            overflow: auto;
        `;
        container.appendChild(left_div)
        container.appendChild(right_div)

        const targetElements = document.querySelectorAll('div.jobs-search-results-list');
        targetElements.forEach((element) => {
            element.addEventListener('click', () => {
                setTimeout(() => {
                    load_home_content();
                }, 1);
            });
        });
        targetElement.insertAdjacentElement('afterend', container);
        attach_click_events()
        setTimeout(() => {
            load_home_content();
        }, 1500);
    }
};
setTimeout(() => {
    load_box();
}, 1500);

function attach_click_events() {
    const targetElements = document.querySelectorAll('div.jobs-search-results__list-item');
    targetElements.forEach((element) => {
        element.addEventListener('click', () => {
            setTimeout(() => {
                load_home_content();
            }, 1000);
        });
    });
}
function load_home_content() {
    let leftBody = document.getElementById("leftBody")
    if (!leftBody) {
        return;
    }
    leftBody.innerHTML = '';
    let right_div = document.getElementById('right_div');
    right_div.innerHTML = '';
    const analysisBTN = document.createElement('button');
    analysisBTN.id = 'analysisBTN';
    analysisBTN.textContent = 'Loading';
    analysisBTN.style.cssText = `
        font-family: 'SF Pro Display', sans-serif;
        cursor: pointer;
        background-color: ${white};
        color: ${dark};
        font-size: 14px;
        height: 35px;
        width: 105px;
        margin-left: calc(50% - 52px);
        margin-top: 25px;
        border-radius: 14.5px;
    `;
    leftBody.appendChild(analysisBTN);
    setTimeout(() => {
        analyze();
    }, 200);
}

function loadAnalysisRight(data){
    
    let rightA = document.getElementById('right_div');
    rightA.innerHTML = '';
    const customScrollbarCSS = `
        #right_div {
            overflow: hidden;
            padding-right : 10px;
        }
        #right_div:hover {
            overflow-y: scroll;
            padding-right : 0px;
        }
        #right_div::-webkit-scrollbar {
            width: 10px;
            right: -10px; 
        }
        #right_div::-webkit-scrollbar-track {
            border-radius: 20px;
            background-color: transparent;

        }
        #right_div::-webkit-scrollbar-thumb {
            border-radius: 20px;
            background-color: ${dark};
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customScrollbarCSS;
    document.head.insertAdjacentElement('beforeend', styleElement);
    const skills = data.technical_skills;
    const skillsDiv = document.createElement('div')
    skillsDiv.id = 'skillsDiv';
    skillsDiv.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        margin: 5px;
    `;
    const divCSS = `
        height: 25px;
        background-color: ${button};
        font-weight: bold;
        font-size: 12px;
        color: white;
        margin: 4px;
        padding-top: 4.5px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 12px;
    `; 
    for (let i = 0; i < skills.length; i++){
        const div = document.createElement('div');
        div.textContent = skills[i];
        div.style.cssText = divCSS;
        skillsDiv.appendChild(div);
    }
    rightA.appendChild(skillsDiv);
};

function analyze() {
    let leftBody = document.getElementById("leftBody")
    if (!leftBody) {
        return;
    }
    let analysisBTN = document.getElementById("analysisBTN")
    analysisBTN.textContent = "Loading"
    // 
    let jd_content = document.querySelector(".jobs-description-content__text")
    jd_content = jd_content.textContent
    let data = {
        "jd": jd_content,
    }
    fetch('http://127.0.0.1:8004/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(response => {
            var applicantsData = document.createElement('div');
            applicantsData.style.cssText = `
                display: flex;
                align-items: center;
                margin-left: 5px;
            `;
            var applicantsImage = document.createElement('a');
            applicantsImage.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.2771 9.81585C14.7963 9.81585 16.0268 8.47865 16.0268 6.83384C16.0268 5.21415 14.8026 3.9209 13.2771 3.9209C11.7704 3.9209 10.5273 5.23298 10.5273 6.8464C10.5336 8.48493 11.7641 9.81585 13.2771 9.81585ZM6.00098 9.96024C7.32562 9.96024 8.39286 8.78627 8.39286 7.33608C8.39286 5.92355 7.32562 4.78097 6.00098 4.78097C4.6889 4.78097 3.60282 5.94238 3.6091 7.34235C3.6091 8.79255 4.68262 9.96024 6.00098 9.96024ZM13.2771 8.71722C12.4107 8.71722 11.6762 7.90109 11.6762 6.84012C11.6762 5.81682 12.4044 5.01953 13.2771 5.01953C14.156 5.01953 14.8779 5.80427 14.8779 6.83384C14.8779 7.88853 14.1497 8.71722 13.2771 8.71722ZM6.00098 8.87416C5.29158 8.87416 4.6889 8.19615 4.6889 7.34235C4.6889 6.52623 5.2853 5.86077 6.00098 5.86077C6.72922 5.86077 7.31934 6.51367 7.31934 7.33608C7.31934 8.19615 6.71666 8.87416 6.00098 8.87416ZM2.54813 15.7296H7.42606C7.08078 15.5287 6.8485 15.0705 6.89244 14.6561H2.49163C2.37235 14.6561 2.32213 14.5996 2.32213 14.4929C2.32213 13.0552 4.00461 11.6867 5.9947 11.6867C6.69783 11.6867 7.40095 11.8624 7.94085 12.1638C8.1543 11.8562 8.41797 11.5925 8.76326 11.3665C7.96596 10.8768 6.97406 10.6131 5.9947 10.6131C3.33915 10.6131 1.19211 12.5091 1.19211 14.5933C1.19211 15.3467 1.64412 15.7296 2.54813 15.7296ZM9.36594 15.7296H17.1882C18.2743 15.7296 18.8016 15.3843 18.8016 14.6436C18.8016 12.9171 16.642 10.6194 13.2771 10.6194C9.91211 10.6194 7.75252 12.9171 7.75252 14.6436C7.75252 15.3843 8.27986 15.7296 9.36594 15.7296ZM9.16504 14.631C9.02065 14.631 8.96415 14.5808 8.96415 14.4678C8.96415 13.5073 10.5148 11.7181 13.2771 11.7181C16.0393 11.7181 17.59 13.5073 17.59 14.4678C17.59 14.5808 17.5335 14.631 17.3828 14.631H9.16504Z" fill="white"/>
                </svg>
            `;
            let applicantsElements = document.getElementsByClassName('jobs-premium-applicant-insights__list-num');
            console.log("length: ", applicantsElements.length)
            let total_applicants = applicantsElements.length > 0 ? applicantsElements[0].innerText : "err_no_premium";
            if(total_applicants == "err_no_premium"){
                const applicantElements = document.querySelectorAll('.job-details-jobs-unified-top-card__primary-description-without-tagline .tvm__text--neutral');
                if (applicantElements.length > 0) {
                    const lastApplicantElement = applicantElements[applicantElements.length - 1];
                    total_applicants = lastApplicantElement.textContent.trim();
                } 
                else {
                    total_applicants = "No applicant info"
                }
            }
            var applicantsText = document.createElement('h4');
            applicantsText.id = "applicantsText"
            applicantsText.innerText = total_applicants + " Applicants";
            applicantsText.style.cssText = `
                color: #FFFFFF;
                font-weight: bold;
                font-size: 12px;
                display: flex;
                margin-left: 5px;
            `;
            applicantsData.appendChild(applicantsImage);
            applicantsData.appendChild(applicantsText);

            var experienceData = document.createElement('div');
                experienceData.style.cssText = `
                    display: flex;
                    align-items: center;
                    margin-left: 5px;
                `;
                var experienceImage = document.createElement('a');
                experienceImage.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.90238 15.8739H15.0977C16.4474 15.8739 17.138 15.1959 17.138 13.8587V7.70637C17.138 6.37545 16.4474 5.69116 15.0977 5.69116H13.7605V5.0257C13.7605 4.06519 13.1453 3.4939 12.0969 3.4939H7.90322C6.85481 3.4939 6.23957 4.06519 6.23957 5.0257V5.69116H4.90238C3.55891 5.69116 2.86206 6.37545 2.86206 7.70637V13.8587C2.86206 15.1959 3.55891 15.8739 4.90238 15.8739ZM7.41354 5.08848C7.41354 4.76203 7.63954 4.55486 7.98483 4.55486H12.0152C12.3668 4.55486 12.5865 4.76203 12.5865 5.08848V5.69116H7.41354V5.08848ZM4.11136 7.74404C4.11136 7.17902 4.40642 6.89652 4.9526 6.89652H15.0475C15.5936 6.89652 15.8824 7.17902 15.8824 7.74404V8.56644C14.1497 9.16284 12.1596 9.4579 10 9.4579C7.84044 9.4579 5.85034 9.16284 4.11136 8.56644V7.74404ZM4.9526 14.6686C4.40642 14.6686 4.11136 14.3923 4.11136 13.821V9.77808C5.39833 10.1673 6.79831 10.4184 8.25478 10.5251V11.0211C8.25478 11.4982 8.53101 11.7619 9.02068 11.7619H10.9794C11.4691 11.7619 11.739 11.4982 11.739 11.0211V10.5251C13.2018 10.4184 14.5955 10.1673 15.8824 9.77808V13.821C15.8824 14.3923 15.5936 14.6686 15.0475 14.6686H4.9526Z" fill="white"/>
                    </svg>
                `;
                var experienceText = document.createElement('h4');
                experienceText.id = "experienceText"
                experienceText.innerText = response.experience + " years experience";
                experienceText.style.cssText = `
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: 12px;
                    display: flex;
                    margin-left: 5px;
                `;
                experienceData.appendChild(experienceImage);
                experienceData.appendChild(experienceText);

                var sponsorData = document.createElement('div');
                sponsorData.style.display = 'flex';
                sponsorData.style.alignItems = 'center';
                sponsorData.style.marginLeft = '5px';

                var sponsorImage = document.createElement('a');
                sponsorImage.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.8851 9.75307C17.8788 9.01228 16.868 8.42843 15.6313 8.42843H13.0511C12.6995 8.42843 12.5677 8.36565 12.3542 8.13337L8.09781 3.53167C7.9597 3.381 7.79647 3.30566 7.61441 3.30566H6.80457C6.64134 3.30566 6.54717 3.45633 6.62251 3.62584L8.82605 8.42215L5.60549 8.77999L4.45663 6.7334C4.36874 6.57645 4.2369 6.50739 4.02973 6.50739H3.74723C3.57772 6.50739 3.46472 6.6204 3.46472 6.7899V12.7162C3.46472 12.8857 3.57772 12.9987 3.74723 12.9987H4.02973C4.2369 12.9987 4.36874 12.9297 4.45663 12.7727L5.60549 10.7199L8.82605 11.084L6.62251 15.8803C6.54717 16.0498 6.64134 16.2005 6.80457 16.2005H7.61441C7.79647 16.2005 7.9597 16.1189 8.09781 15.9745L12.3542 11.3728C12.5677 11.1405 12.6995 11.0777 13.0511 11.0777H15.6313C16.868 11.0777 17.8788 10.4876 17.8851 9.75307Z" fill="white"/>
                    </svg>
                `;
                var sponsorText = document.createElement('h4');
                sponsorText.id = "sponsor_text"
                sponsorText.innerText = response.sponsorship;
                sponsorText.style.cssText = `
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: 12px;
                    display: flex;
                    margin-left: 5px;
                `;
                sponsorData.appendChild(sponsorImage);
                sponsorData.appendChild(sponsorText);
                
                
                var clearanceData = document.createElement('div');
                clearanceData.style.cssText = `
                    display: flex;
                    align-items: center;
                    margin-left: 5px;
                `;
                var clearanceImage = document.createElement('a');
                clearanceImage.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.96865 16.2946C10.0816 16.2946 10.2512 16.2569 10.4144 16.169C14.0242 14.204 15.2797 13.2937 15.2797 11.0086V6.26876C15.2797 5.51542 14.991 5.24547 14.3569 4.97552C13.6663 4.68045 11.3184 3.86433 10.6404 3.63205C10.4269 3.56299 10.1884 3.51904 9.96865 3.51904C9.7552 3.51904 9.51036 3.57554 9.30319 3.63205C8.62517 3.82666 6.27724 4.68673 5.58667 4.97552C4.9526 5.23919 4.66382 5.51542 4.66382 6.26876V11.0086C4.66382 13.2937 5.9194 14.1915 9.52919 16.169C9.69242 16.2569 9.86192 16.2946 9.96865 16.2946ZM9.96865 14.9637C9.88075 14.9637 9.79286 14.9323 9.6108 14.8193C6.74808 13.074 5.85662 12.6032 5.85662 10.7763V6.46966C5.85662 6.24365 5.90056 6.15576 6.07635 6.08043C7.00548 5.71003 8.80723 5.11363 9.63592 4.78718C9.78031 4.73696 9.88075 4.71812 9.96865 4.71812C10.0628 4.71812 10.1633 4.73696 10.3077 4.78718C11.1363 5.11363 12.9255 5.7477 13.8609 6.08043C14.043 6.14948 14.0869 6.24365 14.0869 6.46966V10.7763C14.0869 12.6157 13.1578 13.1117 10.3328 14.8193C10.1507 14.9323 10.0628 14.9637 9.96865 14.9637ZM9.29691 12.5592C9.52919 12.5592 9.72381 12.4462 9.85564 12.239L12.687 7.83196C12.7749 7.70013 12.8439 7.54946 12.8439 7.40506C12.8439 7.09117 12.5677 6.884 12.2664 6.884C12.078 6.884 11.9085 6.99072 11.7767 7.20417L9.27808 11.1906L8.11039 9.71533C7.95972 9.52072 7.80905 9.45166 7.62699 9.45166C7.31309 9.45166 7.06825 9.70278 7.06825 10.0167C7.06825 10.1673 7.12476 10.3055 7.23148 10.4436L8.71306 12.2453C8.88257 12.4588 9.06463 12.5592 9.29691 12.5592Z" fill="white"/>
                    </svg>
                `;
                var clearanceText = document.createElement('h4');
                clearanceText.id = "clearanceText"
                clearanceText.innerText = response.security_clearance;
                clearanceText.style.cssText = `
                    color: #FFFFFF;
                    font-weight: bold;
                    font-size: 12px;
                    display: flex;
                    margin-left: 5px;
                `;
                clearanceData.appendChild(clearanceImage);
                clearanceData.appendChild(clearanceText);
                leftBody.innerHTML = '';
                leftBody.appendChild(applicantsData);
                leftBody.appendChild(experienceData);
                leftBody.appendChild(sponsorData);
                leftBody.appendChild(clearanceData);
                let right_div = document.getElementById('right_div');
                right_div.innerHTML = '';
                loadAnalysisRight(response)
        })
        .catch(error => {
            alert(error)
            let right_div = document.getElementById('right_div');
            right_div.innerHTML = '';
            let leftBody = document.getElementById("leftBody")
            leftBody.innerHTML = '';
        });
}
