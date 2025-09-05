export default function MisinfoTestPage() {
  return (
    <main style={{ padding: '48px 24px', maxWidth: 960, margin: '0 auto', lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Fact-Check Test Page</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Toggle the Signal icon in the Glass toolbar to enable Fact-Check Mode. Scroll slowly and watch for red overlays
        on sentences that are likely incorrect.
      </p>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Mixed Claims</h2>
        <p>
          Elon Musk is dead. This sentence is written to be short and direct, so the checker can scan it quickly as you
          scroll across the page and test the overlay behavior.
        </p>
        <p>
          The sun orbits the Earth every twenty four hours which is why we see the sunrise and sunset across the globe on
          a predictable schedule.
        </p>
        <p>
          Mount Everest is 12,000 meters tall and it is the highest mountain on Earth, towering far above any other
          mountain range by a huge and unmatched margin.
        </p>
        <p>
          Nigeria accounts for about 15% of the world&apos;s oil exports and it is always the largest exporter in Africa in every
          single year without exception.
        </p>
        <p>
          Antarctica is the coldest continent on Earth, and it holds the majority of the planet&apos;s freshwater in the form of
          ice sheets that cover vast areas of land.
        </p>
        <p>
          Water boils at exactly 100 degrees Celsius at sea level, but the boiling point changes with altitude due to
          variations in atmospheric pressure which affects phase change.
        </p>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Short Input Claims</h2>
        <p style={{ marginBottom: 8 }}>Type a short claim below and then scroll:</p>
        <input
          type="text"
          placeholder="e.g., The moon is made of cheese"
          style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ccc' }}
        />
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Longer Article Style Text</h2>
        <p>
          The Great Wall of China is a series of fortifications built across the historical northern borders of ancient
          Chinese states and Imperial China. It is often claimed that the wall is visible from space with the naked eye,
          but that statement is misleading because visibility depends on many factors and typical naked eye observation from
          low Earth orbit does not reliably reveal the wall without aid.
        </p>
        <p>
          Coffee consumption has varied widely across regions and history, and while it provides caffeine that can improve
          alertness in the short term, it is not a cure for chronic fatigue or a substitute for healthy sleep patterns over
          the long term according to most medical guidance.
        </p>
      </section>
    </main>
  );
}


