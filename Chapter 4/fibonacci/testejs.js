var ejs=require('ejs')
  ,fs=require('fs')
  ,str=fs.readFileSync(__dirname+'/../cleaning.ejs','utf8');

  var users = [];

users.push({ name: 'Tobi', age: 2, species: 'ferret' })
users.push({ name: 'Loki', age: 2, species: 'ferret' })
users.push({ name: 'Jane', age: 6, species: 'ferret' })

var ret=ejs.render(str,{
  title:'a test',
  supplies:['foo','bar','baz'],
  users:users
});



console.log(ret);