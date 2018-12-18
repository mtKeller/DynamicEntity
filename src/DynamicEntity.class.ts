/**
 * @license
 * Micah T. Keller. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mtKeller/DynamicEntity
 */

export interface DynamicProperties { };

/**
 * Constructs a `Dynamic Entity` which stores properties in iterable and numerable key value pairs.
 * 
 * * `Note:` When storing this object `YOU MUST DEHYDRATE IT`
 * * And likewise may rehydrate a dehydrated DynamicEntity through it's constructor
 * 
 * * `Common Functions:` append, map, filter, entries, keys, values.
 * 
 * * `Unique Functions` dehydrate
 * 
 * @param list -Optional: generate a Dynamic Entity from a list
 * @param rehydrate -Optional & Override to list param: rehydrate a dehydrated DynamicEntity
 */
export class DynamicEntity implements Iterable<DynamicProperties>{
  public lastIndex = 0;
  length = 0;

  constructor(list?: Array<any>, dehydrated?: Array<Array<(number & any)>>) { 
    Object.defineProperty(this, 'lastIndex', {
      enumerable: false,
      writable: true
    })
    Object.defineProperty(this, 'length', {
      enumerable: false,
      writable: true
    })
    if (list && !dehydrated) {
      for (let i = 0; i < list.length; i++) {
        this[i] = list[i];
        this.lastIndex = i;
        this.length++;
      }
    } else if (dehydrated) {
      for (let i = 0; i < dehydrated.length; i++) {
        if (dehydrated[i][0] === -1) {
          this.lastIndex = dehydrated[i][1];
        } else {
          this[dehydrated[i][0]] = dehydrated[i][1];
          this.length++;
        }
      }
    }
  }


  /**
  * Unique Function `Dehydrate`
  * 
  * * Returns an Array container of [keyValueIndex, Value]
  * * `Note` Stores the next appendable index as [-1, nextAvailableIndex] at the end of the array.
  */
  public dehydrate(): Array<Array<(number & any)>> {
    const dehydrationArr = [];
    for (let props of this) {
      dehydrationArr.push([props, this[Number(props)]]);
    }
    dehydrationArr.push([-1, this.lastIndex]);
    return dehydrationArr;
  }

  public borrow(): Array<(DynamicEntity & any)> {
    return null;
  }

  public return(): DynamicEntity {
    return null;
  }

  /**
  * Common Function `Append`
  * 
  * * `NOTE` Returns a `*new*` DynamicEntity object with the new value added at the end
  * * This is to maintain functional dereferencing of objects
  * 
  * @param value -Required: Function each value is passed through
  */
  public append(value: any): DynamicEntity {
    this.lastIndex++;
    this[this.lastIndex] = value;
    const dehydrated = this.dehydrate();
    return new DynamicEntity(null, dehydrated);
  }
  /**
  * Common Function `Map`
  * 
  * * Returns a new DynamicEntity object with each value mutated by the passed function
  * 
  * @param mapFunc -Required: Function each value is passed through
  */
  public map(mapFunc: Function): DynamicEntity {
    const dehydrated = this.dehydrate();
    for (let i = 0; i < dehydrated.length; i++) {
      if (dehydrated[i][0] !== -1) {
        dehydrated[i][1] = mapFunc(dehydrated[i][1]);
      }
    }
    return new DynamicEntity(null, dehydrated);
  }
  /**
  * Common Function `Filter`
  * 
  * * Returns a new DynamicEntity object that omits key values that do not pass the filterFunc
  * 
  * @param filterFunc -Required: Function each value is passed through
  */
  public filter(filterFunc: Function): DynamicEntity {
    const dehydrated = this.dehydrate();
    const newArr = [];
    for (let i = 0; i < dehydrated.length; i++) {
      if (dehydrated[i][0] !== -1) {
        if (filterFunc(dehydrated[i][1])) {
          newArr.push(dehydrated[i]);
        }
      } else {
        newArr.push(dehydrated[i]);
      }
    }
    return new DynamicEntity(null, newArr);
  }
  /**
  * Common Function `Entries`
  * 
  * * Returns a `Iterator` Object that contains each key value pair
  * 
  */
  public entries(): Iterator<DynamicProperties> {
    let pointer = 0;
    const keys = Object.keys(this);
    const entity = this;

    return {
      next(): IteratorResult<DynamicProperties> {
        if (pointer < keys.length) {
          return {
            done: false,
            value: [pointer, entity[keys[pointer++]]]
          }
        } else {
          return {
            done: true,
            value: null
          }
        }
      }
    };
  }
  /**
  * Common Function `Entries`
  * 
  * * Returns a `Iterator` Object that contains individual value 
  * 
  */
  public values(): Iterator<DynamicProperties> {
    let pointer = 0;
    const keys = Object.keys(this);
    const entity = this;

    return {
      next(): IteratorResult<DynamicProperties> {
        if (pointer < keys.length) {
          return {
            done: false,
            value: entity[keys[pointer++]]
          }
        } else {
          return {
            done: true,
            value: null
          }
        }
      }
    };
  }
  public toString() {
    let outStr = "";
    for (let entry in this.entries()) {
      outStr += entry + '\n'
    }
    return outStr;
  }
  [Symbol.iterator](): Iterator<DynamicProperties> {
    let pointer = 0;
    const keys = Object.keys(this);
    const entity = this;

    return {
      next(): IteratorResult<DynamicProperties> {
        if (pointer < keys.length) {
          return {
            done: false,
            value: keys[pointer++]
          }
        } else {
          return {
            done: true,
            value: null
          }
        }
      }
    };
  }
};