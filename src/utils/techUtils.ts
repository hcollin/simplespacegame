import { DATATECHNOLOGY } from "../data/dataTechnology";
import { Technology, FactionModel, TechnologyField, FactionTechSetting } from "../models/Models";



export function canAffordTech(tech: Technology, faction: FactionModel): boolean {

    let canAfford: boolean = true;

    tech.fieldreqs.forEach((val: [TechnologyField, number]) => {

        const field = faction.technologyFields.find((f: FactionTechSetting) => f.field === val[0]);
        if(!field) {
            throw new Error(`Unknown technology requirement field ${val[0]}`);
        }
        
        if(field.points < val[1]) {
            canAfford = false;
        }
        console.log(tech.name, field.field, field.points, val[1], canAfford);
        
    });

    if(tech.techprereq.length > 0 && canAfford) {
        tech.techprereq.forEach((tid: string) => {
            if(!faction.technology.includes(tid)) {
                canAfford = false;
            }
        })
    }

    return canAfford;

}

export function factionPaysForTech(fields: FactionTechSetting[], tech: Technology): FactionTechSetting[] {

    return fields.map((tf: FactionTechSetting) => {

        const cost = tech.fieldreqs.find((tr: [TechnologyField, number]) => tr[0] === tf.field);
        if(cost) {
            tf.points -= cost[1];
        }

        return {...tf};
    })

}

export function getTechById(techId: string): Technology {
    const tech = DATATECHNOLOGY.find((t: Technology) => t.id === techId);
    if(!tech) {
        throw new Error(`Not a valid technology id ${techId}`);
    }
    return tech;


}

/**
 * Total value (as in cost) for the provided technology. This useful in sorting for example.
 * 
 * @param tech 
 */
export function getTechValue(tech: Technology): number {
    
    const reqSum = tech.fieldreqs.reduce((tot: number, req: [TechnologyField, number]) => {
        return tot + req[1];
    }, 0);

    

    return reqSum + (tech.techprereq.length * 5);
}