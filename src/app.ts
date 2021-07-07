
// AutoBind Decorator that is used for binding 'this' to local bounded functions.
function autoBind(
    target:any,
    methodName:String,
    descriptor:PropertyDescriptor
){
    console.log("Calling Decorator");
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
        if(title.trim().length === 0 ||
        description.trim().length === 0||
        peopleCount.trim().length === 0){
            alert("Invalid inputs !, Please try again");
            return ;
        }
        else{
            return [title,description,+peopleCount];
        }
    }

    private clearInputs(){
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    @autoBind
    private submitHandler(event: Event){
        console.log("Calling submit handler");
        event.preventDefault();
        console.log("Submitting data ...");
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