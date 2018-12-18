export { DynamicEntity } from './src/DynamicEntity.class';

// let demoEntity = new DynamicEntity([0,1,2,3,4,5]);

// console.log("Outputs: ", (demoEntity));
// // Prints: { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }

// console.log("Outputs: ", demoEntity[3]);
// // Prints: 4
// demoEntity = demoEntity.append('ketchup');
// demoEntity = demoEntity.filter((entry) => entry !== 4);

// console.log("Outputs: ", demoEntity[6]);


// demoEntity = demoEntity.append('sriracha');
// demoEntity = demoEntity.filter((entry) => entry !== 'ketchup');
// demoEntity = demoEntity.append(123);

// console.log("Outputs: ", demoEntity);

// console.log("Outputs: ", demoEntity[4]);

// demoEntity = demoEntity.map((entry) => {
//     if (typeof entry === "number") {
//         return entry * 2;
//     } else {
//         return (entry[0] as string).toUpperCase() + (entry as string).slice(1) + " so tasty!"
//     }
// })

// let held;
// [ demoEntity, held] = demoEntity.borrow((val) => 10 === val);

// console.log("Outputs: ", held);
// console.log("Outputs: ", demoEntity);

// demoEntity = demoEntity.return(held);

// console.log("Outputs: ", demoEntity);