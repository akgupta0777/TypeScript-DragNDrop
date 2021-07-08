// Validation
interface Validatable {
    propertyName: string;
    value: string | number;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validationOf(validatableInput : Validatable){
    let isValid = true;
    if(validatableInput.required){
        isValid = isValid && (validatableInput.value.toString().trim().length !== 0);
        if(!isValid) console.log("Reason : Value is required!");
    }
    if(validatableInput.minLength && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        if(!isValid) console.log("Reason : minimum length is not maintained");
    }
    if(validatableInput.maxLength && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        if(!isValid) console.log("Reason : maximum length is not maintained");
    }
    if(validatableInput.min){
        isValid = isValid && (+validatableInput.value >= validatableInput.min);
        if(!isValid) console.log("Reason : minimum value is not maintained ");
    }
    if(validatableInput.max){
        isValid = isValid && (+validatableInput.value <= validatableInput.max);
        if(!isValid) console.log("Reason : maximum value is not maintained");
    }
    if(!isValid) console.log("Error in : ",validatableInput.propertyName);
    return isValid;
}

// AutoBind Decorator that is used for binding 'this' to local bounded functions.
function autoBind(
    target:any,
    methodName:String,
    descriptor:PropertyDescriptor
){
    const originalMethod = descriptor.value;
    const adjustableDescriptor: PropertyDescriptor = {
        configurable : true,
        get(){            
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjustableDescriptor;
}

// Project Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
        this.attach();
        this.configure();   
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin",this.element);
    }
    
    private gatherInputs() : [string ,string,number] | void{
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const peopleCount = this.peopleInputElement.value;

        const titleValidator : Validatable = {propertyName:"Title",value:title,required:true,minLength:5}; 
        const descriptionValidator : Validatable = {propertyName:"Description",value:description,required:true,minLength:10,maxLength:50}; 
        const peopleValidator : Validatable = {propertyName:"People",value: +peopleCount,required:true,min:1,max:10}; 
        
        if(validationOf(titleValidator) &&
           validationOf(descriptionValidator) &&
           validationOf(peopleValidator)
        ){
            return [title,description,+peopleCount];
        }
        else{
            alert("Invalid inputs ! Please try again");
            return ;
        }
    }

    private clearInputs(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    @autoBind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInputs = this.gatherInputs();
        if(Array.isArray(userInputs)){
            const [title,description,peopleCount] = userInputs;
            console.log(title,description,peopleCount);
        }
        this.clearInputs();
        
    }

    private configure() {
        this.element.addEventListener("submit",this.submitHandler);
    }
}

const projInput = new ProjectInput();