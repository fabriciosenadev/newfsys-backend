
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('fsys_categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('fsys_categories').insert([
        {
          category: 'salary', 
          applicable: "in",
          created_at: knex.fn.now()
        },                
        {
          category: 'food', 
          applicable: "out",
          created_at: knex.fn.now()
        },                
        {
          category: 'beauty', 
          applicable: "out",
          created_at: knex.fn.now()
        },                
        {
          category: 'education', 
          applicable: "out",
          created_at: knex.fn.now()
        },                
        {
          category: 'recreation', 
          applicable: "out",
          created_at: knex.fn.now()
        },                
        {
          category: 'health', 
          applicable: "out",
          created_at: knex.fn.now()
        },                
        {
          category: 'transport', 
          applicable: "out",
          created_at: knex.fn.now()
        },                
      ]);
    });
};
