# DynamicEntity

Designed to be a companion object to be used in conjunction with [ActionStrategy](https://www.npmjs.com/package/actionstrategy) or plain [NgRx](https://ngrx.io). DynamicEntity is a Control Data Structure that facilatates the use of Indexes as **address pointers** in Javascript.

##By Example

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

In this implementation a DynamicEntity is designed to be part of slice of state and point to another slice. Not to replace reducer's functionalism with an extra layer of abstraction to avoid boilerplate.

With the reliance on a simple iterative Index Key, is to reinforce that what this pattern enables in Node. An abstract means of creating an address pointer that is comparable to a traditional low level language's implementation. By keeping the implementation simple and Array like, it is to emphasize the use of **"Array of Index Structures"** to control logic flow. Via the removal or borrowing (*Rust like ownership*) of entries.
