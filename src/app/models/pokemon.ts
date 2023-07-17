export interface Pokemon {
    name: string,
    id: number,
    abilities: { ability: { name: string, url: string } }[],
    moves: { move: { name: string, url: string }, version_group_details:{level_learned_at: number, move_learn_method: {name: string, url: string}}[] }[],
    stats: { base_stat: number, stat: { name: string, url: string } }[],
    types: { type: { name: string, url: string } }[],
    sprites: any,
    species : {name: string, url: string},
    url: string;
}