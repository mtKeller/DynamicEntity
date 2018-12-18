# DynamicEntity

Designed to be a companion object to be used in conjunction with [ActionStrategy](https://www.npmjs.com/package/actionstrategy) or plain [NgRx](https://ngrx.io), but can also stand on it's own.

DynamicEntity is a Control Data Structure that facilitates the use of Indexes as **address pointers** in Javascript.

## By Example

```javascript
import { DynamicEntity } from 'dynamicentity'

let demoEntity = new DynamicEntity([0,1,2,3,4,5]);

console.log("Outputs: ", (demoEntity));
// Outputs:  DynamicEntity { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 }

console.log("Outputs: ", demoEntity[3]);
// Outputs:  3

demoEntity = demoEntity.append('ketchup');
console.log("Outputs: ", demoEntity[6]);
// Outputs:  ketchup

demoEntity = demoEntity.filter((entry) => entry !== 4);

console.log("Outputs: ", demoEntity[4]);
// Outputs:  undefined

demoEntity = demoEntity.append('sriracha');
demoEntity = demoEntity.filter((entry) => entry !== 'ketchup');
demoEntity = demoEntity.append(123);

console.log("Outputs: ", demoEntity);
// Outputs:  DynamicEntity { '0': 0, '1': 1, '2': 2, '3': 3, '5': 5, '7': 'sriracha', '8': 123 }

demoEntity = demoEntity.map((entry) => {
    if (typeof entry === "number") {
        return entry * 2;
    } else {
        return (entry[0] as string).toUpperCase() + (entry as string).slice(1) + " so tasty!"
    }
})

console.log("Outputs: ", demoEntity);
/**
*  Outputs:  DynamicEntity {
*  '0': 0,
*  '1': 2,
*  '2': 4,
*  '3': 6,
*  '5': 10,
*  '7': 'Sriracha so tasty!',
*  '8': 246 }
*/
```

This is to unfortunately contrast against NgRx's own Entity approach. As what this accomplish is a pure implementation of the "Entity" Pattern. As such is just an object that maintains a set of properties that are key value pairs.

In this implementation a DynamicEntity is designed to be part of a feature's state and capable of pointing towards reference of state. Not to replace reducer's functionalism with an extra layer of abstraction in order to avoid boilerplate.

With the reliance on a simple iterative Index Key, is to reinforce that what this pattern enables in Node. An abstract means of creating an address pointer that is comparable to a traditional low level language's implementation. By keeping the implementation simple and Array like, it is to emphasize the use of **"Array of Index Structures"** to control logic flow. Via the removal or borrowing (*Rust like ownership*) of entries.

## Borrow and Return

The second attribute of a DynamicEntity are the functions borrow() and return().

In order to prevent racing across systems, individual properties may be snipped out and returned with a new DynamicEntity via borrow(). Only to later be included back into the Entity's properties via return().

What this accomplishes is functional encapsulation of working state. **If a property is remotely being worked on, remove from properties.**

```javascript
//Continuation of above
let held;
[ demoEntity, held] = demoEntity.borrow((val) => 10 === val);

console.log("Outputs: ", held);
console.log("Outputs: ", demoEntity);
/**
 * Outputs:  [ 5, 10 ]
 * Outputs:  DynamicEntity {
 *  '0': 0,
 *  '1': 2,
 *  '2': 4,
 *  '3': 6,
 *  '7': 'Sriracha so tasty!',
 *  '8': 246 }
 */

demoEntity = demoEntity.return(held);

console.log("Outputs: ", demoEntity);
/**
 * Outputs:  DynamicEntity {
 *  '0': 0,
 *  '1': 2,
 *  '2': 4,
 *  '3': 6,
 *  '5': 10,
 *  '7': 'Sriracha so tasty!',
 *  '8': 246 }
 */
```

## Best Practices

Things to keep in mind to improve robustness of your applications.

1. **Values must have a significant and unique field.**

2. Borrow and Return are optional, but **highly recommended** for complex reactive applications to avoid races.

3. DynamicEntity becomes secondary in terms of logic flow when used with a Pointer Store.

## PointerStore

A pointer store is an Array that can store single keys that point to values in an DynamicEntity.
Or can be a Container Array an Array that houses *Key* and it's **"Child Reference"**.
Etc...

```javascript
const pointerStore = [0, 3, 2, 6, 4];

const pointerStoreWithChildren = [
        [0, 6],
        [1, 1],
        [2, 7],
        [3, 3],
        [4, 0],
        [5, 10]
    ];
```

Nothing fancy, but facilitates ease of rendering large objects in frontend in addition to allowing for **priority** sorting. Or simply streamline computation in the back.

## Closing

DynamicEntity is designed to be functionally similar to Arrays as possible. Thus DynamicEntity has the following functions:

* `Common Functions:`

** map()
** filter()
** entries()
**values()

* `Unique Functions`

** append()
** dehydrate()
** borrow()
**return()

CI tests to come for final version. Questions, comments, issues, look to associated github.