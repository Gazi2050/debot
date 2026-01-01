export class AppStore {
    isEnglish = $state(true);
    textInput = $state("");
    isSpeaking = $state(false);
    isPaused = $state(false);
    isTranslating = $state(false);
    isLoadingAudio = $state(false);
}

export const appState = new AppStore();
