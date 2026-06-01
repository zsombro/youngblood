import { System } from '../system';
export declare const ScriptSystem: System;
export interface Script {
    update: Function;
}
export declare const script: (data?: Script | undefined) => import('../main').Component<Script>;
