
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('fsys_categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('fsys_categories').insert([
        {
          category: 'Salário', 
          applicable: "in",
          is_custom: 'no',
          created_at: knex.fn.now()
        },                
        {
          category: 'Alimentação', 
          applicable: "out",
          is_custom: 'no',
          created_at: knex.fn.now()
        },                
        {
          category: 'Beleza', 
          applicable: "out",
          is_custom: 'no',
          created_at: knex.fn.now()
        },                
        {
          category: 'Educação', 
          applicable: "out",
          is_custom: 'no',
          created_at: knex.fn.now()
        },                
        {
          category: 'Lazer', 
          applicable: "out",
          is_custom: 'no',
          created_at: knex.fn.now()
        },                
        {
          category: 'Saúde', 
          applicable: "out",
          is_custom: 'no',
          created_at: knex.fn.now()
        },                
        {
          category: 'Transporte', 
          applicable: "out",
          is_custom: 'no',
          created_at: knex.fn.now()
        },                
      ]);
    });
};
