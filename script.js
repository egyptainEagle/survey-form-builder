//UI Elements:
const Form = document.querySelector("form");
const EditSection = document.querySelector("aside").children[2];
const CreateSection = document.querySelector("aside").children[1];
const EditSectionBtn = document.querySelector(".aside-header__edit-btn");
const CreateSectionBtn = document.querySelector(".aside-header__create-btn");
const resetBtn = document.querySelector("button.form-header__reset-btn");
const asideElement = document.querySelector("aside");
const printBtn = document.querySelector("button.form-footer__print-btn");
const copyHTMLBtn = document.querySelector("button.form-footer__copy-btn");
//Edit Section Elements:
const EditElementType = EditSection.querySelector(".edit-section__element-type");
const EditElementName = EditSection.querySelector(".edit-section__name-attribute");
const EditOptionType = EditSection.querySelector(".edit-section__type-attribute");
//Globals:
var activeAsideSection = CreateSection;
var asideButtons  = document.querySelector("aside header").children;
var currentlyEditingElement = null;

var optionTypes = {"Single Choice": "radio", "Multiple Choice": "checkbox"};

//Global Functions:
function activateAsideSection(section){
  if (section){
    for(let index = 0; index <asideButtons.length; index++){
      if (asideButtons[index].textContent.toLowerCase() == section){
       //Toggle the required section button "active" style on and "inactive" style off:
         asideButtons[index].classList.add("aside__aside-header--active");
         asideButtons[index].classList.remove("aside__aside-header--inactive");
        }else{
            //Toggle every other button "inactive" style on and "active" style off:
            asideButtons[index].classList.remove("aside__aside-header--active");
            asideButtons[index].classList.add("aside__aside-header--inactive");
        }
      
         
      for(const asideChild of asideElement.children){

        if (asideChild.getAttribute("kind") !== section) {
          //Hide all other elements inside the <aside> except the <header>:
          if (asideChild.tagName !=="HEADER"){
              asideChild.style.position = "absolute";
              asideChild.style.visibility = "hidden";
          }
         }

        if (asideChild.getAttribute("kind") == section) {
  
          //Display the required section's div:
          if (asideChild.style.position !== "static"){
            asideChild.style.position = "static";
            asideChild.style.visibility = "visible";
          }
        }


     
      }
             
    }
 } 
}


function activateEditFields(state = true){
//Enable all Edit section inputs:
  if(state){
   for (const editElement of EditSection.children){
    if (editElement.classList.value !== "edit-section__element-type"){         editElement.style.opacity = "100%";
       editElement.children[0].disabled = false; 
         editElement.style.opacity = "100%";
    }
   }   
 }else {
  for (const editElement of EditSection.children){
    if (editElement.classList.value !== "edit-section__element-type"){         editElement.style.opacity = "100%";
        editElement.style.opacity="30%";
        //The try/catch block is just for skipping any errors coming form .querySelector("input") since some elements don't have an input element insde them;
        try{editElement.querySelector("input").disabled = true;}catch(error){} 
         editElement.style.opacity="30%";
         console.log("Option");
    }
   }   
 }

}
//Manipulation Objects:
const MainForm = {
form: Form,
addSection(sectionTypeClass = "radio"){
  let newSection = document.createElement("section");
  newSection.classList.add("form-section");
  newSection.setAttribute("kind", sectionTypeClass);
  newSection.id = this.form.children.length+1;
  if (sectionTypeClass !== "text"){
  newSection.innerHTML =`<div class="form-section__section-edit-group">
  <button class="section-edit-group__delete-btn" type="button">DELETE</button>
  <button class="section-edit-group__add-btn" type="button">ADD</button></div>
<h3 class="form-section__form-question">Untitled</h3>
<div class="form-section__form-options"> </div>`;
 }else{
  newSection.innerHTML = `<div class="form-section__section-edit-group">
  <button class="section-edit-group__delete-btn" type="button">DELETE</button></div>
<h3 class="form-section__form-question">Untitled</h3>
<textarea class="form-section__response"></textarea>`;
 }
 this.form.appendChild(newSection);
  return newSection;
},
// FEATURE UPDATE:
formatHTML(){
return "";
},
/*----------*/

};

const FormSection = {
  sectionElement: null,
  optionElement: null,
setQuestion(sectionElement = this.sectionElement,newQuestion = "Untitled"){
  const questionElement = sectionElement.querySelector("h3")
  questionElement.textContent = newQuestion
},

setOptionText(optionElement, text = optionElement.childNodes[0].textContent){
  optionElement.childNodes[0].textContent = text
},
setOptionType(optionElement, optionType) {
//Error Handling: Setting a default value of optionType as its section's kind attribute:
  if(optionType !== undefined){
  for (const section of Form.querySelectorAll("section")){
      if (section.contains(optionElement)){
          optionType = section.getAttribute("kind");
      }
  }
}
/*------------------*/
optionElement.querySelector("input").type = optionType;
},

addOption(section,optionType = section.getAttribute("kind") , optionText = `Option${section.querySelector("div.form-section__form-options").length}`,optionalArg = null){
  if (optionType !== "text"){ 
  const optionElement = document.createElement("label");
  const divOptions = section.querySelector("div.form-section__form-options");
  optionElement.innerHTML = `<input name="${section.id}" type="${section.getAttribute("kind")}" class="form-options__option"/>Option${divOptions.children.length+1}
  <div class="form-section__edit-group">
   <button class="edit-group__delete-btn" type="button">DELETE</button>
   <button class="edit-group__edit-btn" type="button">EDIT</button>
 </div>`;
 optionElement.classList.add("form-options__option");
  divOptions.appendChild(optionElement);
  }
}

}



//--------------------------------------------------------//


//Initialization:
{
//Focus on Create Section
activateAsideSection("create");
//Change active section when clicked(any element inside the <header> of <aside>):
 //Loopting through each element is the <header> of <aside> and get it to display when clicked:
 for(const asideHeaderButton of asideElement.querySelector("header").children){
    asideHeaderButton.addEventListener("click", ()=> activateAsideSection(asideHeaderButton.getAttribute("name")));
  }

  activateEditFields(false);
}

function createNewElement(event){
const clickedElement = event.target;
if (clickedElement.tagName == "img"){
  MainForm.addSection(clickedElement.parentElement.getAttribute("kind"));
}else{
  MainForm.addSection(clickedElement.getAttribute("kind"));
}
}
CreateSection.addEventListener("click", createNewElement);

function handleFormClicks(event){
 //delete Element when clicked "Delete Button":
 const clickedElement = event.target;
 /*  //Open Edit Panel when EDIT is clicked on:
  if (clickedElement.classList.value === "edit-group__edit-btn"){ 
    new Promise(clickedElement =>{
    activateAsideSection("edit");
    activateEditFields();
    const currentlyEditingElement = clickedElement.parentElement.parentElement;
 
    EditElementType.querySelector("span").textContent = "Option";
    EditElementName.querySelector("input").value = (currentlyEditingElement.childNodes[1].textContent.replace(/\s+/gi,""));
    EditElementName.childNodes[0].textContent = "Option Text:";
    EditOptionType.childNodes[0].textContent = "Option Type:";
    EditOptionType.querySelector("select").children[0].textContent ="Single Choice Button";
    EditOptionType.querySelector("select").children[1].textContent ="Multiple Choice Button";
  }) 
  }*/
 if (clickedElement.classList.value.match("delete-btn")){
   clickedElement.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement);
 }

 //add new option:
 if (clickedElement.classList.value.match("add-btn")){
  event.preventDefault()
  FormSection.addOption(clickedElement.parentElement.parentElement);
 }



 //Open the Edit panel when element is clicked:
  if (clickedElement.parentElement.tagName.toLowerCase() === "section" || clickedElement.parentElement.parentElement.tagName.toLowerCase() === "section"){
    if (!clickedElement.classList.value.match("delete")){
       //Open the Edit pannel:
       activateAsideSection("edit");
       currentlyEditingElement = clickedElement;
    }
  }
 //Set Edit section input fields with current element's data:
 if(currentlyEditingElement.tagName.toLowerCase() === "label" || currentlyEditingElement.tagName.toLowerCase() === "input"){
  currentlyEditingElement =(clickedElement.tagName === "INPUT")? clickedElement.parentElement:(clickedElement.tagName === "LABEL")? clickedElement:null;
  activateEditFields();
  EditElementType.querySelector("span").textContent = "Option";
  EditElementName.querySelector("input").value = (currentlyEditingElement.childNodes[1].textContent.replace(/\s+/gi,""));
  EditElementName.childNodes[0].textContent = "Option Text:";
  EditOptionType.childNodes[0].textContent = "Option Type:";
  EditOptionType.querySelector("select").children[0].textContent ="Single Choice Button";
  EditOptionType.querySelector("select").children[1].textContent ="Multiple Choice Button";

  //Hide Option Function field if it is a question (<h3>):
 }else if (currentlyEditingElement.tagName.toLowerCase() === "h3"){
  activateEditFields();
  currentlyEditingElement = clickedElement;
  EditElementName.childNodes[0].textContent = "Section Question:";
  EditOptionType.childNodes[0].textContent = "Section Type:";
  EditOptionType.querySelector("select").children[0].textContent ="Single Choice Question";
  EditOptionType.querySelector("select").children[1].textContent ="Multiple Choice Question";

  EditElementType.querySelector("span").textContent = "Section";
  EditElementName.querySelector("input").value = (currentlyEditingElement.textContent.replace(/\s(2,)/gi,""));
 }
}
Form.addEventListener("click", handleFormClicks);
function onFormNotFocused(event){
const clickedElemenet = event.target;
if((clickedElemenet.tagName.toLowerCase() === "h3"|| clickedElemenet.tagName.toLowerCase() === "input"|| clickedElemenet.tagName.toLowerCase() === "label") ==false){
 //Checks to see if the element clicked is inside <aside>:
 if (!asideElement.contains(clickedElemenet)){
  //Disable the input fields of Edit Section:
activateEditFields(false);
//Set all fields to the default options:
EditElementName.querySelector("input").value = "";
EditElementType.querySelector("span").textContent = "None";
}
}
}
document.body.addEventListener("click", onFormNotFocused);

function handleDoubleClicks(event){
const clickedElement = event.target;
//Change form's question text (h3) when double clicked:
function setNewTtitle(element,oldTitle){
  if (element.innerText.replace(/\s+/g,"")){
    element.innerText = element.innerText; 
  }else {
    element.innerText = oldTitle;
  }
   
}
if(clickedElement.classList.value == "form-section__form-question"){
 let title = clickedElement.textContent;
  clickedElement.contentEditable = true; 
  clickedElement.style.color = "gray";
  clickedElement.focus();
 clickedElement.addEventListener("keydown",event =>{if (event.key == "Enter"){setNewTtitle(clickedElement, title); clickedElement.contentEditable = false; clickedElement.style.color = "black";}});
 clickedElement.addEventListener("blur",event=>{setNewTtitle(clickedElement,title);clickedElement.contentEditable = false; clickedElement.style.color = "black";});
}

}
Form.addEventListener("dblclick", handleDoubleClicks)

function resetForm(){
Form.innerHTML = "";
}
resetBtn.addEventListener("click", resetForm);

//Display the print dialogue when print is pressed:
printBtn.addEventListener("click", () => print() );


function onAsideElementsChange(event){
const asideElement = event.target;
//Setting Current Element Being Edited;
//Change the element text when Enter is pressed:
{ 
if (event.key === "Enter"){

  if (asideElement.parentElement.classList.value === "edit-section__name-attribute" ){
    //Change Element's text if it's not the same as the old one, or if its not bunch of blank spaces;
     //Checking if the input text not consisting of blank spaces:
     const inputTextSpaceCount = (asideElement.value.match(/\s/g))?asideElement.value.match(/\s/g):[];
    if (inputTextSpaceCount.length !== asideElement.value.length){
        //Changing the element text to the input value:
        currentlyEditingElement.childNodes[0].textContent = asideElement.value.replace(/\s{2}(?=[A-z0-9])/gi,"")
      }
  }
}
}
//Change the element type when a new <option> is selected:
 if (currentlyEditingElement.tagName.toLowerCase() === "h3"){
     //Change <section> kind attribute:
     for (const kindValue in optionTypes){
       if (EditOptionType.querySelector("select").value.match(kindValue)){
         //Change Section kind attribute which decides the next input child element's type:      
          currentlyEditingElement.parentElement.setAttribute("kind", optionTypes[kindValue]);              
        //Change all section's previous input elements to that new kind:     
          {
           const sectionElement = currentlyEditingElement.parentElement.querySelector("div.form-section__form-options");
            for (const labelElement of sectionElement.children){
              //Finding Every <label> and changing its inputs' type attribute:
               if (labelElement.tagName.toLowerCase() == "label"){
                  labelElement.childNodes[0].type = optionTypes[kindValue];
               }                 
            }
            }
            }


     }
 }else if (currentlyEditingElement.tagName.toLowerCase() === "label"){
   for (const kindValue in optionTypes){
    if (EditOptionType.querySelector("select").value.match(kindValue)){
      currentlyEditingElement.childNodes[0].type = optionTypes[kindValue];
      
    }
  }
 }
}
asideElement.addEventListener("keyup",onAsideElementsChange);
EditOptionType.querySelector("select").addEventListener("change",onAsideElementsChange)

