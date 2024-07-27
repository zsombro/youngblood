import { component } from "../components/component";
import { System } from "../system";

export const ScriptSystem: System = {
    id: 'scriptSystem',
    requiredComponents: ['script'],
    update(e, scene, services, frameData) {
        e.get(script).update(e)
    },
}

export interface Script {
    update: Function
}

export const script = component<Script>('script')