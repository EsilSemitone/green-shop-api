import { Container } from 'inversify';
import { App } from '../../app.js';

export interface IMainReturnType {
    app: App;
    container: Container;
}
