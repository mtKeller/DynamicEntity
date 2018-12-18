# DynamicEntity

Designed to be a companion object to be used in conjunction with [ActionStrategy](https://www.npmjs.com/package/actionstrategy) or plain [NgRx](https://ngrx.io). DynamicEntity is a Control Data Structure that optimizes the use of index pointers in Javascript.

By example what this structure accomplishes
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