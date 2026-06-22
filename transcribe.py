import os
import json
import whisper

def transcribe_audio():
    # Load Whisper model (base or tiny is perfect for short clips)
    print("Loading Whisper model...")
    model = whisper.load_model("base")
    
    audio_dir = "/Users/rolfhammerstad/GitHub/agentic-ai-talk/public/tts"
    files = [f for f in os.listdir(audio_dir) if f.endswith(".mp3")]
    
    print(f"Found {len(files)} audio files to transcribe.")
    
    for i, file_name in enumerate(sorted(files)):
        mp3_path = os.path.join(audio_dir, file_name)
        json_path = os.path.join(audio_dir, os.path.splitext(file_name)[0] + ".json")
        
        # Skip if already transcribed
        if os.path.exists(json_path):
            print(f"[{i+1}/{len(files)}] Skipping {file_name} (already transcribed)")
            continue
            
        print(f"[{i+1}/{len(files)}] Transcribing {file_name}...")
        try:
            # Transcribe specifying Norwegian language
            result = model.transcribe(mp3_path, language="no", word_timestamps=True)
            
            # Format transcription segments
            subtitles = []
            for segment in result.get("segments", []):
                subtitles.append({
                    "start": segment["start"],
                    "end": segment["end"],
                    "text": segment["text"].strip()
                })
                
            # Write to JSON file
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(subtitles, f, ensure_ascii=False, indent=2)
                
            print(f"  Saved subtitles to {os.path.basename(json_path)}")
            
        except Exception as e:
            print(f"  Error transcribing {file_name}: {e}")

if __name__ == "__main__":
    transcribe_audio()
