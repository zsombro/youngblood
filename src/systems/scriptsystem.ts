import Component from "../components/component";
import { System } from "../system";

export const ScriptSystem: System = {
    id: 'scriptSystem',
    requiredComponents: ['Script'],
    update(e, scene, services, frameData) {
        (<Script>e['Script']).update(e)
    },
}

export class Script extends Component {
    update: Function

    constructor(update: Function) {
        super('Script')

        this.update = update
    }
}