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
  private _nextIndex = 0;
  length = 0;

  constructor(list?: Array<any>, dehydrated?: Array<Array<(number & any)>>) { 
    Object.defineProperty(this, '_nextIndex', {
      enumerable: false
    })
    Object.defineProperty(this, 'length', {
      enumerable: false
    })
    Object.defineProperty(this, 'dehydrate', {
      enumerable: false
    })
    Object.defineProperty(this, 'append', {
      enumerable: false
    })
    Object.defineProperty(this, 'map', {
      enumerable: false
    })
    Object.defineProperty(this, 'filter', {
      enumerable: false
    })
    Object.defineProperty(this, 'entries', {
      enumerable: false
    })
    Object.defineProperty(this, 'values', {
      enumerable: false
    })
    if (list && !dehydrated) {
      for (let i = 0; i < list.length; i++) {
        this[i] = list[i];
        this._nextIndex = i;
        this.length++;
      }
    } else if (dehydrated) {
      for (let i = 0; i < dehydrated.length; i++) {
        if (dehydrated[i][0] === -1) {
          this._nextIndex = dehydrated[i][1];
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
    for (let props in this.entries()) {
      dehydrationArr.push(props);
    }
    dehydrationArr.push([-1, this._nextIndex]);
    return dehydrationArr;
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
    this[this._nextIndex] = value;
    this._nextIndex++;
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

    return {
      next(): IteratorResult<DynamicProperties> {
        if (pointer < keys.length) {
          return {
            done: false,
            value: [pointer, this[keys[pointer++]]]
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

    return {
      next(): IteratorResult<DynamicProperties> {
        if (pointer < keys.length) {
          return {
            done: false,
            value: this[keys[pointer++]]
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
  [Symbol.iterator](): Iterator<DynamicProperties> {
    let pointer = 0;
    const keys = Object.keys(this);

    return {
      next(): IteratorResult<DynamicProperties> {
        if (pointer < keys.length) {
          return {
            done: false,
            value: this[pointer++]
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