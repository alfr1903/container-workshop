import { StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const furiousChatGPTResponse = `
No no no no no!
These ingredients are NOT going to cut it! 
What am i cooking for, a low-budget funeral?? 

Here is a REAL recipe, I present to you the Moonlit Dreamcatcher Delight!

ingredients:

    1 cup of cloud fluff (alternatively, use the lightest whipped cream you can find)
    3 slices of moonbeam (a thin slice of pearlescent edible glitter gelatin will do)
    A pinch of starlight sparkle (edible glitter or sugar crystals work well)
    5 drops of essence of night breeze (a mix of lavender and mint extract)
    A handful of dreamberries (blueberries dipped in a shimmering edible silver dust)
    2 spoons of solar syrup (a golden honey and saffron blend)
    1 piece of the rainbow’s end (a slice of multicolored layer cake)
    A whisper of unicorn laughter (a pinch of pop rocks for a surprising fizz)

Equipment:

    A mixing bowl as light as a feather
    A spoon made from the wishes of a shooting star
    Serving plates that have caught the first light of dawn

Preparation:

    Begin by laying your cloud fluff at the base of your serving plate, spreading it evenly to form a cushion of dreams.
    Carefully place the moonbeam slices atop the cloud fluff, allowing them to catch the light and shimmer.
    Sprinkle the starlight sparkle gently over everything, ensuring a delicate twinkle is visible with every glance.
    In a feather-light mixing bowl, combine the essence of night breeze with the dreamberries. Stir gently with your shooting star spoon until the berries are coated in a mist of flavor.
    Drizzle the solar syrup in a spiral, starting from the center and moving outward, to mimic the galaxy’s spin.
    Artfully arrange the slice of the rainbow’s end on the side, providing a burst of color and a gateway to flavors unknown.
    For the final touch, whisper your happiest thought over the dish and sprinkle it with the unicorn laughter. The pop rocks add not just a surprise but also the magic of joy and laughter to every bite.

Serving Instructions:

Serve this dish under a canopy of twinkling lights or by the gentle luminescence of a full moon. It's best enjoyed with an open heart and a vivid imagination, allowing each bite to transport you to a world of dreams and wonders.

`;

export async function POST(req: NextRequest) {
  await req.json();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(furiousChatGPTResponse);
      controller.close();
    }
  });
  return new StreamingTextResponse(stream);
}
