enum ProjectStatus {
    Active,
    Finished
}

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(templateId: string,hostId: string,insert:InsertPosition, newElementId?: string){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostId)! as T;

        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as U;
        if(newElementId)
            this.element.id = newElementId;
        this.attach(insert);
    }
    private attach(insert: InsertPosition){
        this.hostElement.insertAdjacentElement(insert,this.element);
    }
    abstract configure(): void;
    abstract renderContent(): void;
    
}

// Project Class
class Project {
    constructor(
    public id: string, 
    public title: string, 
    public description: string, 
    public people: number,
    public status:ProjectStatus){

    }
}

// Listener Type Defination
type Listener<T> = (Item : T[]) => void

class State<T>{
    protected listeners : Listener<T>[] = [];
    
    addListeners(listenerFn:Listener<T>){
        this.listeners.push(listenerFn);
    }
}

// Application State Management
class StateManager extends State<Project>{
   private projects : Project[] = [];
   private static instance: StateManager;
   constructor() {
       super();
   }
   
   addProject(title:string,description:string,people:number){
    const newProject = new Project(Math.random().toString(),title,description,people,ProjectStatus.Active);
    this.projects.push(newProject);
    for(const listenerFn of this.listeners){
        listenerFn(this.projects.slice());
    }
   }
   static getInstance(){
    if(this.instance){
        return this.instance;
    }
    this.instance = new StateManager();
    return this.instance;
   }
}

const manager = StateManager.getInstance();

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

class projectItem extends Component<HTMLUListElement,HTMLLIElement>{
    project: Project;
    constructor(hostId: string,project: Project){
        super("single-project",hostId,"beforeend",project.id);
        this.project = project;
        this.renderContent();
    }
    configure() {}
    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.project.people.toString()+" People(s).";
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}

// Project List Class
class ProjectList extends Component<HTMLDivElement,HTMLElement> {
    assignedProjects: Project[] = [];

    constructor(private type : "active" | "finished") {
        super("project-list","app","beforeend",`${type}-projects`);
        manager.addListeners((projects:Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === "active"){
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
        this.renderContent();
    }
    
    private renderProjects(){
       const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
       listEl.innerHTML = "";
       for(const project of this.assignedProjects){
        //    const listItem = document.createElement("li");
        //    listItem.textContent = project.title;
        //    listEl.appendChild(listItem);
        new projectItem(this.element.querySelector("ul")!.id,project);
       }
    }

    configure(){}

    renderContent(){
        const listID = `${this.type}-project-list`;
        this.element.querySelector("ul")!.id = listID;
        this.element.querySelector("h2")!.innerText = `${this.type.toUpperCase()}-PROJECTS`
    }

}

// Project Input Class
class ProjectInput extends Component<HTMLDivElement,HTMLFormElement> {
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

const projInput = new ProjectInput();
const activeProject = new ProjectList("active");
const finishedProject = new ProjectList("finished");
