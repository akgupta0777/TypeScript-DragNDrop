import {Project,ProjectStatus} from "../Models/project.js"

// Listener Type Defination
type Listener<T> = (Item : T[]) => void

class State<T>{
    protected listeners : Listener<T>[] = [];
    
    addListeners(listenerFn:Listener<T>){
        this.listeners.push(listenerFn);
    }
}

// Application State Management
export class StateManager extends State<Project>{
   private projects : Project[] = [];
   private static instance: StateManager;
   constructor() {
       super();
   }
   
   addProject(title:string,description:string,people:number){
    const newProject = new Project(Math.random().toString(),title,description,people,ProjectStatus.Active);
    this.projects.push(newProject);
    this.update();
   }

   moveProject(id: string,newStatus: ProjectStatus){
    const project = this.projects.find(prj => prj.id === id);
    if(project && project.status != newStatus){
        project.status = newStatus;
        this.update();
    }
   }

   update(){
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

export const manager = StateManager.getInstance();
