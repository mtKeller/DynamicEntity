/**
* An Entity is an object that has any number of Key Value Pairs: ` number : value `
*/
/* tslint:disable */
export interface DynamicProperties { };
/* tslint:enable */

/**
 * @license
 * Micah T. Keller. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/mtKeller/DynamicEntity
 */

/**
 * Constructs a `Dynamic Entity` which stores properties in iterable and numerable key value pairs.
 *
 * * `Note:` When storing this object `YOU MUST DEHYDRATE IT`
 * * And likewise may rehydrate a dehydrated DynamicEntity through it's constructor
 *
 * * `Common Functions:` append(), map(), filter(), entries(), values().
 *
 * * `Unique Functions` dehydrate(), borrow(), return()
 *
 * @param list -Optional: generate a Dynamic Entity from a list
 * @param rehydrate -Optional & Override to list param: rehydrate a dehydrated DynamicEntity
 */
export class DynamicEntity<T> implements Iterable<DynamicProperties> {
  public lastIndex = 0;
  length = 0;

  constructor(list?: Array<any>, dehydrated?: Array<Array<(number & any)>>) {
    Object.defineProperty(this, 'lastIndex', {
      enumerable: false,
      writable: true
    });
    Object.defineProperty(this, 'length', {
      enumerable: false,
      writable: true
    });
    if (list && !dehydrated) {
      for (let i = 0; i < list.length; i++) {
        this[i] = list[i] as T;
        this.lastIndex = i;
        this.length++;
      }
    } else if (dehydrated) {
      for (let i = 0; i < dehydrated.length; i++) {
        if (dehydrated[i][0] === -1) {
          this.lastIndex = dehydrated[i][1];
        } else {
          this[dehydrated[i][0]] = dehydrated[i][1]  as T;
          this.length++;
        }
      }
    }
  }


  /**
   * Unique Function `Dehydrate`
   *
   * * Returns an Array container of `[ number, any ]`
   * @param storeLastIndex - If set to false the dehydrated object will lose the `lastIndex` property for rehydration.
   *  * Otherwise stores the last index as `[ -1, number ]` at the end of the returned array.
   */
  public dehydrate(storeLastIndex: boolean = true): Array<Array<(number & T)>> {
    const dehydrationArr = [];
    for (const props of this) {
      dehydrationArr.push([props, this[Number(props)]]);
    }
    if (storeLastIndex) {
      dehydrationArr.push([-1, this.lastIndex]);
    }
    return dehydrationArr;
  }
  /**
   * Unique Function `Borrow`
   * 
   * @param selectFunc - Must return true to match the property to be borrowed
   * @returns Array: `[ DynamicEntity, [ number, any ] ]` for deconstruction
   */
  public borrow(selectFunc: Function): Array<(DynamicEntity<T> & T)> {
    let borrowed;
    const dehydrated = this.dehydrate();
    const newArr = [];
    for (let i = 0; i < dehydrated.length; i++) {
      if (dehydrated[i][0] !== -1) {
        if (selectFunc(dehydrated[i][1])) {
          borrowed = dehydrated[i];
        } else {
          newArr.push(dehydrated[i]);
        }
      } else {
        newArr.push(dehydrated[i]);
      }
    }
    borrowed = [ Number(borrowed[0]), borrowed[1] ];
    return [ new DynamicEntity<T>(null, newArr), borrowed ];
  }
  /**
   * Unique Function `Return`
   *
   * * Adds a property into a new DynamicEntity with it's keys sorted high to low.
   *
   * @param returned - Key value pair array `[ number, any ]` that is inserted into a new Entity
   * @returns The new DynamicEntity
   */
  public return(returned: Array<(number & T)>): DynamicEntity<T> {
    let dehydrated = this.dehydrate();
    dehydrated.push(returned);
    dehydrated = dehydrated.sort((a, b) => {
      if ( a[0] < b[0] ) {
        return -1;
      }
      if ( a[0] > b[0] ) {
        return 1;
      }
      return 0;
    });
    return new DynamicEntity<T>(null, dehydrated);
  }

  /**
   * Common Function `Append`
   *
   * * `NOTE` Returns a `*new*` DynamicEntity object with the new value added at the end
   * * This is to maintain functional dereferencing of objects
   *
   * @param value -Required: Function each value is passed through
   * @returns The new DynamicEntity
   */
  public append(value: T): DynamicEntity<T> {
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
   * @returns The new DynamicEntity
   */
  public map(mapFunc: Function): DynamicEntity<T> {
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
   * * Returns a new DynamicEntity object that omits key values that pass the filterFunc
   *
   * @param filterFunc -Required: Function each value is passed through
   * @returns The new DynamicEntity
   */
  public filter(filterFunc: Function): DynamicEntity<T> {
    const dehydrated = this.dehydrate();
    const newArr = [];
    if (dehydrated[-1] !== undefined) {
      newArr.push(dehydrated[-1]);
    }
    for (let i = 0; i < dehydrated.length; i++) {
      if (filterFunc(dehydrated[i][1])) {
        newArr.push(dehydrated[i]);
      }
    }
    return new DynamicEntity<T>(null, newArr);
  }
  /**
   * Common Function `Entries`
   *
   *@returns An `Iterator` Object that contains each key value pair
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
          };
        } else {
          return {
            done: true,
            value: null
          };
        }
      }
    };
  }
  /**
   * Common Function `Values`
   *
   * @returns An`Iterator` Object that contains the value of properties
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
          };
        } else {
          return {
            done: true,
            value: null
          };
        }
      }
    };
  }
  public toString() {
    let outStr = '';
    /* tslint:disable */
    for (const entry in this.entries()) {
      outStr += entry + '\n';
    }
    /* tslint:enabled */
    return outStr;
  }
  [Symbol.iterator](): Iterator<DynamicProperties> {
    let pointer = 0;
    const keys = Object.keys(this);

    return {
      next(): IteratorResult<DynamicProperties> {
        if (pointer < keys.length) {
          return {
            done: false,
            value: keys[pointer++]
          };
        } else {
          return {
            done: true,
            value: null
          };
        }
      }
    };
  }
}
