module.exports = function(dust){
    dust.helpers.custom_button = function(chunk, context, bodies, params) {
        console.log(context.blocks);
        return chunk.write("Probando helper");
        return chunk.render(function(){
            return "Probando helper";
        });
        return chunk.tap(function(data) {
            return "Probando helper";
            //return data.toUpperCase();
        }).render(bodies.block, context).untap();
    }
}