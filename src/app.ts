
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
    
    @autoBind
    private submitHandler(event: Event){
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }

    private configure() {
        this.element.addEventListener("submit",this.submitHandler);
    }
}

const projInput = new ProjectInput();