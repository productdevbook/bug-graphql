import { Injectable } from 'graphql-modules'

export interface HStorage {
   hello(): string
 }

@Injectable()
export class HStorage implements HStorage {}
