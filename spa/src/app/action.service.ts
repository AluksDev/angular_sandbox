import { Injectable } from "@angular/core";
import { GameQuestionCreateFormService } from "@api/form-service";

@Injectable({
  providedIn: "root",
})
export class ActionService {
  // @ts-ignore
  private actions = {};

  objets = {
    GameQuestionCreateFormService: GameQuestionCreateFormService,
  };
  // private actions = {};

  constructor() {}

  public getAction(actionStr: string): any {
    const array = [];
    try {
      const keys = actionStr.split(".");

      keys.forEach((value) => {
        array.push(this.objets[value]);
      });
      return array;
    } catch {
      // debugger;
      // alert("Error obteniendo la acción del permiso: " + actionStr);
    }
  }
}
