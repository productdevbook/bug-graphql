import { Injectable } from 'graphql-modules'
import type { Storage as IStorage } from '../../../repository/type.js'

export interface HStorage extends IStorage { }

@Injectable()
export class HStorage implements HStorage {}
