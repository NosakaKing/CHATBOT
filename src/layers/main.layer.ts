import { BotContext, BotMethods } from "@builderbot/bot/dist/types";
import { getHistoryParse } from "../utils/handleHistory";
import AIClass from "../services/ai";
import { flowSeller } from "../flows/seller.flow";

const PROMPT_DISCRIMINATOR = `### Historial de Conversación (Vendedor/Cliente) ###
{HISTORY}

### Intenciones del Usuario ###

**HABLAR**: Selecciona esta acción si el cliente parece necesitar más información sobre el producto

### Instrucciones ###

Por favor, analiza la siguiente conversación y determina la intención del usuario.`;

export default async (_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {
    const ai = extensions.ai as AIClass;
    const history = getHistoryParse(state);
    const prompt = PROMPT_DISCRIMINATOR.replace('{HISTORY}', history);

    console.log(prompt);

    const { prediction } = await ai.determineChatFn([
        {
            role: 'system',
            content: prompt
        }
    ]);

    console.log({ prediction });

    if (prediction.includes('HABLAR')) return gotoFlow(flowSeller);
};