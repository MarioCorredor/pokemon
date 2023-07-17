export interface Species {
    base_happiness: number,
    capture_rate: number,
    evolution_chain: { url: string },
    evolves_from_species: { name: string, url: string },
    flavor_text_entries: { flavor_text: string, language: { name: string, url: string }, version: { name: string, url: string } }[],
    form_descriptions: {description: string, language: { name: string, url: string }, forms_switchable: boolean}[],
    generation: {name: string, url: string},
    growth_rate: {name: string, url: string},
    habitat: {name: string, url: string}, 
    has_gender_differences: boolean,
    is_legendary: boolean,
    is_mythical: boolean,
    name: string,
    pokedex_numbers: {entry_number: number, pokedex: {name: string, url: string}}[],
    shape: {name: string, url: string},
    varieties: {is_deafult: boolean, pokemon: {name: string, url: string}}[],
    imageUrl?: string
}