import Component from "./base-component";
import {Validatable,validationOf} from "../utils/validation";
import autoBind from "../Decorators/autobind";
import { manager } from "../state/project-state";

// Project Input Class
export default class ProjectInput extends Component<HTMLDivElement,HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input","app","afterbegin","user-input");
        this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
        this.configure();   
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
            manager.addProject(title,description,+peopleCount);
            console.log(title,description,peopleCount);
        }
        this.clearInputs();
        
    }

    configure() {
        this.element.addEventListener("submit",this.submitHandler);
    }
    
    renderContent() {}
}