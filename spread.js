
const penguin = {
    name: 'bernard',
    type: 'emperor'
};

// const obj = {
//     _id: 123,
//     name: penguin.name,
//     type: penguin.type
// };

const obj = {
    _id: 123,
    ...penguin
};

console.log(obj);